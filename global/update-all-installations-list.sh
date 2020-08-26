#!/bin/sh
curl https://iqss.github.io/dataverse-installations/data/data.json | jq . > all-dataverse-installations.json
