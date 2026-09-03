# Contributing to RankPilot-AI 

First off, thank you for considering contributing to RankPilot-AI! It's people like you that make RankPilot-AI such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](https://github.com/Aryan-tech46/Rank-Pilot-AI/issues) page to see if someone else has already created a ticket. If not, go ahead and [make one](https://github.com/Aryan-tech46/Rank-Pilot-AI/issues/new)!

## Fork & create a branch

If this is something you think you can fix, then fork RankPilot-AI and create a branch with a descriptive name.

A good branch name would be (where issue #123 is the ticket you're working on):

```bash
git checkout -b 123-add-feature-name
```

## Get the test suite running

Make sure you have Node.js installed. We recommend the latest LTS version.

```bash
npm install
npm run server
```

## Make your changes

Make your changes in your branch, ensuring you follow our coding style guidelines. We use ESLint to maintain code quality. You can check your code by running:

```bash
npm run lint
```

## Commit your changes

Make sure your commit messages are descriptive.

```bash
git commit -m "feat: add keyword density checker component (#123)"
```

## Push to your fork

```bash
git push origin 123-add-feature-name
```

## Create a Pull Request

At this point, you should go back to your fork on GitHub and create a pull request. Please ensure that your pull request description clearly describes the problem and solution. Include the relevant issue number if applicable.

## Review Process

Once your pull request is submitted, maintainers will review your code. We may suggest some changes or improvements or alternative ways to fix the problem.

Thank you for contributing!
