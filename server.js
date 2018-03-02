const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

const issues = [
    {
       id: 1,status: 'Open', owner: 'Tom',
        created: new Date('2018-01-28'),effort: 5, completionDate: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2,status: 'Assigned', owner: 'Blake',
        created: new Date('2018-03-01'),effort: 14, completionDate: undefined,
        title: 'Error in console when clicking Add',
    },
];


const validIssueStatus = {
    New: true,
    Open: true,
    Assigned: true,
    Fixed: true,
    Verified: true,
    Closed: true,
};

const issueFieldType = {
    id: 'required',
    status: 'required',
    owner: 'required',
    effort: 'optional',
    created: 'required',
    completionDate: 'optional',
    title: 'required',

};


function validateIssue(issue){
    for (const field in issueFieldType){
        const type = issueFieldType[field];
        if (!type){
            delete issue[field];
        }else if (type === 'required' && !issue[field]){
            return `${field} is required.`;
        }
    }

    if (!validIssueStatus[issue.status])
        return `${issue.status} is not a valid status.`;
    
    return null;
}

app.get('/api/issues', (req,res) => {
   const metadata = {total_count: issues.length};
   console.log('hi');
   res.json({_metadeta: metadata, records: issues});
    });

app.post('/api/issues', (req,res) =>{
    const newIssue = req.body;
    newIssue.id = issues.length + 1;
    newIssue.created = new Date();

    if (!newIssue.status)
        newIssue.status = 'New';

    const err = validateIssue(newIssue)

    if (err){
    res.status(422).json({ message: `Invalid request: ${err}`});
    return;
    }

    issues.push(newIssue);
    res.json(newIssue);
});



app.listen(3000, () => {
   console.log("App started on port 3000"); 
});