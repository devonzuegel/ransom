# Ransom

# Development scripts

An array of development scripts can be found under `bin/` (e.g. `bin/start`), rather than the usual place in [package.json](package.json). However Heroku deploys work by looking at the scripts under [package.json](package.json), so the minimum necessary scripts are defined there for deploys to do their job.

NOTE: Because this is a _side project_ with a single developer and not a business or large project, many of these scripts do dangerous things like resetting the prod db. HANDLE WITH CARE!

## FAQs

**Q:** Why is there a `postinstall` script that executes `rm -f node_modules/web3/index.d.ts`?

**A:** The types inside of web3 conflict with the proper definitions. For more info:

- https://github.com/ethereum/web3.js/issues/1658#issuecomment-395662469
- https://github.com/ethereum/web3.js/issues/1596
