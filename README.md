# Wait until workflow is finished

This action waits until a given workflow run finishes.

repository:
    required: true
    description: Repository name (e.g. romanrod/wait-for-woprkflp).
  worflow_name:
    required: true
    description: The name of the workflow the action will wait for.
  run_id:
    description: 'Id of workflow to wait for. If you used `benc-uk/workflow-dispatch` to dispatch, you can use ${{ steps.<step-name>.outputs.workflowId }}'
    required: true
  timeout:
    required: false
    description: Timeout in seconds.
    default: 600

## Inputs


### `repository`

**Required** Repository name (e.g. romanrod/wait-for-woprkflp).

### `workflow_name`

**Required** The name of the workflow the action will wait for.

### `run_id`

**Required** 'Id of workflow to wait for. If you used `benc-uk/workflow-dispatch` to dispatch, you can use `${{ steps.<step-name>.outputs.workflowId }}`'

### `timeout`

**Required** Timeout in seconds. Default `600`.

## Outputs

`workflowStatus`

## Example

### Single Commit Status

```yaml
- name: Invoke workflow in another repo with inputs
  uses: romanrod/workflow-dispatch@master
  id: workflow
  with:
    workflow: my-workflow.yaml
    repo: romanrod/somerepo
    inputs: '{ "message": "blah blah", "something": false }'

- uses: romanrod/wait-for-workflow@main
  with:
    repository: romanrod/somerepo
    workflow_name: 'Workflow name'
    run_id: ${{ steps.workflow.outputs.runId }}
    timeout: 300
```
## Development

To update `dist/index.js`:

```sh
npm install
npx ncc build index.js
```
