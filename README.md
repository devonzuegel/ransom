# Ransom

**A note on running development scripts:** An array of development scripts can be found under `bin/` (e.g. `bin/start`), rather than the usual place in [package.json](package.json). However Heroku deploys work by looking at the scripts under [package.json](package.json), so the minimum necessary scripts are defined there for deploys to do their job.
