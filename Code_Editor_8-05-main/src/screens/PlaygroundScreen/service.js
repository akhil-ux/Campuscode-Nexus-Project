const languageCodeMap = {
    cpp: 54,
    python: 92,
    javascript: 93,
    java: 91,
  };
  
  async function getSubmission(tokenId) {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '105623b674msh9efb86c825a72b9p144c2ajsn183dd87575e6',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      }
    };
  
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Failed to fetch submission. Status: ${response.status}`);
    return await response.json();
  }
  
  export async function makesubmission({ code, language, callback, stdin = '' }) {
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
  
    const httpOptions = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '105623b674msh9efb86c825a72b9p144c2ajsn183dd87575e6',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language_id: languageCodeMap[language],
        source_code: btoa(code),
        stdin: btoa(stdin),
      })
    };
  
    try {
      callback({ apiStatus: 'loading' });
  
      const response = await fetch(url, httpOptions);
      if (response.status === 429) {
        callback({ apiStatus: 'error', message: 'Rate limit exceeded. Please wait and try again.' });
        return;
      }
  
      const result = await response.json();
      const tokenId = result.token;
  
      if (!tokenId) {
        callback({ apiStatus: 'error', message: 'No token received from Judge0 API.' });
        return;
      }
  
      let statusCode = 1;
      let submissionResult;
  
      while (statusCode === 1 || statusCode === 2) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec between checks
        submissionResult = await getSubmission(tokenId);
        statusCode = submissionResult.status.id;
      }
  
      callback({ apiStatus: 'success', data: submissionResult });
    } catch (error) {
      callback({ apiStatus: 'error', message: error.message });
    }
  }
  