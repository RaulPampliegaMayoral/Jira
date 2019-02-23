'use strict';

const JiraApi = require('jira-client');

const jira = new JiraApi({
    protocol : 'https',
    host: 'jira.bmcs.es',
    username: '******',
    password: '******',
    apiVersion: '2',
    strictSSL: true
});

let issueITId = -1;
let issueNetComId = -1;
jira.findIssue("IT-3")
.then(issueIT => issueITId = issueIT.id)
.then(dump => jira.findIssue("NET-78"))
.then(issue => issueNetComId = issue.id)
.then(issueId => jira.getIssueWorklogs(issueId))
.then(data => {
    data.worklogs.filter(c => c.comment.toLowerCase().indexOf("retrospectiva") > -1).forEach(wk => {
        wk.timeSpentSeconds = null;
        jira.addWorklog(issueITId, wk) //por defecto se tiene el ajuste auto
        .then(response => jira.deleteWorklog(issueNetComId, wk.id))
        .catch(error => console.log(error));        
    });
})
.catch(error => console.log(error));
