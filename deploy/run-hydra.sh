podman run --rm -itd --name hydra -v $PWD:/work --net host -w /work oryd/hydra:v1.7.4 serve all --config config.yaml --dangerous-force-http --disable-telemetry
podman exec -it hydra hydra --endpoint http://localhost:4445 clients import example-client.json
