podman run --rm -it --name hydra -v $PWD:/work --net host -w /work oryd/hydra:v1.7.4 serve all --config config.yaml --dangerous-force-http --disable-telemetry
