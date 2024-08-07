# Player CMS Helm Chart

## Table Of Contents

1. [Helm](#helm)

## Helm

### FAQ

#### Install Helm Chart Release

```bash
helm install (release-name|--generate-name) . [--dry-run|debug] --namespace "prd" --create-namespace
```

#### Listing Helm Chart Releases

```bash
helm list --all
```

#### Upgrading a Helm Chart Release

Get the Helm Chart *release name*.

With the necessary changes applied to the _Helm chart_

```bash
helm upgrade (release-name) [--dry-run|--debug] .
```

#### Uninstalling a Helm Chart Release

Get the Helm Chart *release name*

Uninstall the Helm Chart release with the following command.

```bash
helm uninstall (release-name)
```