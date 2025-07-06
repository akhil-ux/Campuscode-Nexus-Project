const languageCodeMap =
{
    cpp: 54,
    python: 92,
    javascript: 93,
    java: 91,
}
const code = `
#include<iostream>
using namespace std;
int main()
{
    int a , b;
    cin>>a>>b;
    cout<<2*a+3*b<<"output"<<endl;
    return 0;
}
`;

const input = "10 12";

const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
const options = {
    method: 'POST',
    headers: {
        'x-rapidapi-key': '105623b674msh9efb86c825a72b9p144c2ajsn183dd87575e6',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        language_id: 52, // C++
        source_code: btoa(code),
        stdin: btoa(input),
    })
};

async function callApi() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const tokenId = result.token;
        console.log("Token:", tokenId);

        let statusCode = 2;

        while (statusCode === 1 || statusCode === 2) {
            const submission = await getSubmission(tokenId);
            statusCode = submission.status_id;
            console.log("Status:", submission.status.description);
            if (statusCode !== 1 && statusCode !== 2) {
                console.log("Output:", atob(submission.stdout));
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait before retry
        }
    } catch (error) {
        console.error("Error Occurred", error);
    }
}

async function getSubmission(tokenId) {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '105623b674msh9efb86c825a72b9p144c2ajsn183dd87575e6',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };
    try
    {
        const response= await fetch(url,options);
        const result = await response.json();
        return result;
    }
    catch(error)
    {
        console.error({error});
    }
}

callApi();
