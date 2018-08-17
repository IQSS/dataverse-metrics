# metrics.dataverse.org

## Introduction

https://dataverse.org/metrics only shows metrics for Harvard Dataverse but our goal is to show metrics for all installations of Dataverse around the world that are interested in displaying them.

Dataverse 4.9 and higher exposes metrics via API as JSON using a Metrics API that is documented at http://guides.dataverse.org/en/4.9.2/api/metrics.html

Now that some Dataverse installations have been upgraded 4.9 and higher, we can start to the code in this repo to host a service that aggregates metrics across various Dataverse installations.

## Requirements

- Python 2 or Python 3

## Getting Started

Clone the repo:

    git clone https://github.com/IQSS/metrics.dataverse.org.git

Change to the directory you just created:

    cd metrics.dataverse.org

Copy `config.json.sample` to `config.json` and edit the following values:

- `installations`: An array of Dataverse installation URLs.
- `api_response_cache_dir`: Fully qualified directory where JSON files representing API responses will be stored.
- `aggregate_output_dir`: Fully qualified directory where TSV output files of aggregated metrics will be stored.

You can probably ignore the other values in `config.json` but here are the descriptions:

- `num_months_to_process`: For monthly metrics, the number of months to go back in time to download metrics from each Dataverse installation.
- `endpoints`: An array of Metrics API endpoints to process (i.e. `datasets/bySubject`).

Now that your `config.json` file is ready, download the JSON files to the `api_response_cache` directory:

    python3 download.py

(Please note that if you don't have Python 3 installed, Python 2 should work fine too but Python 3 is highly recommended because Python 2 will not be maintained past January 1, 2020 according to https://pythonclock.org and [PEP 373][].)

Then, aggregate the metrics in the JSON files into a TSV file for each endpoint that will be saved in the `aggregate_output_dir` directory:

    python3 aggregate.py

## Contributing

We love contributors! Please see our [Contributing Guide][] for ways you can help and check out the to do list below.

## To Do

- Add license.
- Write tests.
- Drop support for Python 2. See https://python3statement.org

## Contact

[Contributing Guide]: CONTRIBUTING.md
[PEP 373]: https://www.python.org/dev/peps/pep-0373/
