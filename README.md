# setup-openhsp

<!-- gha-description-start -->

Set up your GitHub Actions workflow with a specific version of OpenHSP.

<!-- gha-description-end -->

## Example

### Minimal

```yml
- name: Setup OpenHSP
  uses: BonyChops/setup-openhsp@v1
```

### Options

```yml
- name: Setup OpenHSP
  uses: BonyChops/setup-openhsp@v1
  with:
    # (Optional) Specify the list of build targets.
    build-target: |
      hspcmp
      hsp3cl

    # (Optional) Specify the OpenHSP version.
    openhsp-version: v3.6

    # (Optional) parallel-build-num
    parallel-build-num: 3
```

## Inputs

Overview of Inputs.

<!-- gha-inputs-start -->

### `build-targets`

**Required:** `false`  
**Default:** `hspcmp
hsp3cl
`

Specify the list of build targets.

### `openhsp-version`

**Required:** `false`  
**Default:** `v3.6`

Specify the OpenHSP version.

### `parallel-build-num`

**Required:** `false`  
**Default:** `3`

Specify the number of parallel builds.

<!-- gha-inputs-end -->
