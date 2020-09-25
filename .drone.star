TAG_PATTERN = "${DRONE_TAG:-${DRONE_COMMIT_SHA:0:7}}"
TARGET_ARCH_LIST = ["amd64", "arm64"]
REPO_LIST = ["hydra", "hydra-maester", "kubectl"]

def main(ctx):
  pipeline_list = []
  for arch in TARGET_ARCH_LIST:
    pipeline_list.extend([image_build(ctx, arch)])
  pipeline_list.extend([docker_manifest(ctx)])
  return pipeline_list

def image_build(ctx, arch):
  return {
    "kind": "pipeline",
    "type": "docker",
    "name": "%s" % (arch),
    "platform": {
      "arch": arch
    },
    "steps": [
      {
        "name": "submodules",
        "image": "yaamai/alpine-git:20200913",
        "commands": [
          "git submodule update --init --recursive --remote"
        ]
      },
      {
        "name": "image-build",
        "image": "plugins/docker",
        "settings": {
          "username": {
            "from_secret": "docker_username"
          },
          "password": {
            "from_secret": "docker_password"
          },
          "dockerfile": "Dockerfile",
          "build_args": [
            "GOARCH=%s" % arch,
            "ARCH=%s" % arch
          ],
          "repo": "%s/midp" % (ctx.repo.namespace),
          "tags": ["%s-%s" % (TAG_PATTERN, arch)]
        }
      }
    ]
  }

def docker_manifest(ctx):
  return {
    "kind": "pipeline",
    "type": "docker",
    "name": "manifest",
    "steps": [
      {
        "name": "push-manifest",
        "image": "plugins/manifest",
        "settings": {
          "username": {
            "from_secret": "docker_username"
          },
          "password": {
            "from_secret": "docker_password"
          },
          "target": "%s/midp:%s" % (ctx.repo.namespace, TAG_PATTERN),
          "template": "%s/midp:%s-ARCH" % (ctx.repo.namespace, TAG_PATTERN),
          "platforms": [
            "linux/amd64",
            "linux/arm64"
          ]
        }
      }
    ],
    "depends_on": ["%s" % (arch) for arch in TARGET_ARCH_LIST]
  }
