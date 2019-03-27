#!/bin/sh
curl https://services.dataverse.harvard.edu/miniverse/map/installations-json | jq . > all-dataverse-installations.json
