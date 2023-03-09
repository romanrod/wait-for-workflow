const core = require('@actions/core')
const [owner, repo] = core.getInput('repository').split('/')
const runId = core.getInput('run_id')
const workflowName = core.getInput('workflow_name')
const timeout = Number.parseInt(core.getInput('timeout'), 10)

core.debug(`repository ${repo}`)
core.debug(`runId ${runId}`)
core.debug(`workflowName ${workflowName}`)
core.debug(`timeout ${timeout}`)

async function run () {
  const initialTime = Date.now()
  try {
    
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
      owner: owner,
      repo: repo,
      run_id: runId
    });

    while (response.data.status === "queued" || response.data.status === "in_progress") {
      console.log(`Workflow is still ${response.data.status}...`);
      
      if ((Date.now() - initialTime) > timeout) {
        console.log(`Timed out (${timeout}), aborting.`)
        process.exit(1)
      }
      await new Promise(r => setTimeout(r, 5000));
      response = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{runId}', {
        owner: owner,
        repo: repo,
        run_id: runId
      });
    }

    const statusResult = response.data.status
    console.log(`Workflow status: ${statusResult}`);
    console.log(`Workflow completed! with status: ${statusResult}`);
    core.setOutput('workflowStatus', statusResult)

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

console.log(`Waiting until workflow ${workflowName} on ${repo} finish.`)
run()
