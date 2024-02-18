# Contributing

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)


## Requirements

- [Kubectl]()
- [Minikube]()
- [Kustomize]()

## Getting Started

The repository makes use of [Minikube](https://minikube.sigs.k8s.io/docs/start/) to run the application stack locally. The `packages/orchestration` folder defines the [Kustomize](https://kubectl.docs.kubernetes.io/) _'Kubernetes Resource Object (KRO)'_ files to orchestrate the _k8's_ application.

See this [guide](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/helloWorld/README.md) to get started creating the _k8's_ resources.