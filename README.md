# dataverse-metrics

## Introduction

dataverse-metrics aggregates metrics from multiple Dataverse installations and visualizes them on a web page.

dataverse-metrics was designed to aggregate metrics across all installations of Dataverse around the world, but can also be configured for a single installation of Dataverse. It makes use of the Dataverse [Metrics API][] that was added in Dataverse 4.9.

## Requirements

- Python 2 or Python 3
- a web browser

## Getting Started

Clone the repo:

    git clone https://github.com/IQSS/dataverse-metrics.git

Change to the directory you just created:

    cd dataverse-metrics

Copy `config.json.sample` to `config.json` and edit the following values:

- `installations`: An array of Dataverse installation URLs.
- `api_response_cache_dir`: Fully qualified directory where JSON files representing API responses will be stored.
- `aggregate_output_dir`: Fully qualified directory where TSV output files of aggregated metrics will be stored.
- `num_months_to_process`: For monthly metrics, the number of months to go back in time to download metrics from each Dataverse installation.
- `endpoints`: An array of Metrics API endpoints to process. Note that the three types are `single` (e.g. `datasets/bySubject`), `monthly` (e.g. `downloads/toMonth`) and `monthly_itemized` (at the time of the writing, the only supported endpoint of this type is `datasets/bySubject/toMonth` - this is a hybrid of the first two types, where the `datasets/bySubjects` metrics are broken down by month). 
- `blacklists`: Arrays of terms to blacklist. Only the `datasets/bySubject` endpoint can have a blacklist.
- `colors`: A single color for bar charts and a palette of colors for tree maps.

Now that your `config.json` file is ready, run the `metrics.py` script to create a TSV file for each of the `endpoints`, which will be placed in the `aggregate_output_dir` directory:

    python3 metrics.py

(Please note that if you don't have Python 3 installed, Python 2 should work fine too but Python 3 is highly recommended because Python 2 will not be maintained past January 1, 2020 according to https://pythonclock.org and [PEP 373][].)

The list of Dataverse installations depends on `all-dataverse-installations.json` which can be updated with the following script as new installations are added to the [map][] produced by [miniverse][]:

    ./update-all-installations-list.sh

## Contributing

We love contributors! Please see our [Contributing Guide][] for ways you can help and check out the to do list below.

## To Do

- Add license.
- Drop support for Python 2. See https://python3statement.org

[![Build Status](https://travis-ci.org/IQSS/dataverse-metrics.svg?branch=master)](https://travis-ci.org/IQSS/dataverse-metrics)

[Metrics API]: http://guides.dataverse.org/en/latest/api/metrics.html
[map]: https://dataverse.org
[miniverse]: https://github.com/IQSS/miniverse
[Contributing Guide]: CONTRIBUTING.md
[PEP 373]: https://www.python.org/dev/peps/pep-0373/
