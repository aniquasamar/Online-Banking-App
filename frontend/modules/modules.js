import axios from"axios";

//http request
export const http = (accessToken=null) =>{
    axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
    if(accessToken){
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    return axios;
}


//trim data

export const trimData = (obj) => {
  let finalObj = {};

  for (let key in obj) {
    let value = obj[key];

    if (typeof value === 'string') {
      finalObj[key] = value.trim().toLowerCase();
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      finalObj[key] = value.toString();
    } else {
      finalObj[key] = value;
    }
  }

  return finalObj;
};

export const uploadFile = async (file, folderName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);

  try {
    const httpReq = http();
    const response = await httpReq.post(`/api/upload?folderName=${folderName}`, formData);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

//fetcher
export const fetchData = async (api) => {
  try {
    const httpReq = http();
    const { data } = await httpReq.get(api);
    return data;
  } catch (error) {
    return null;
  }
};

// formate date
export const formatDate = (d) => {
    const date = new Date(d);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yy = date.getFullYear();
    let tt = date.toLocaleTimeString();
    dd = dd < 10 ? "0" + dd : dd;
    mm = mm < 10 ? "0" + mm : mm;
    return `${dd}-${mm}-${yy} ${tt}`;
};

// print transactions history
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=900,height=650');
    printWindow.document.write(`
      <html>
        <head>
          <title>Transaction History</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
              font-size: 13px;
            }
            th {
              background-color: #f4f6f9;
              font-weight: bold;
            }
            .credit {
              color: green;
              font-weight: 600;
            }
            .debit {
              color: red;
              font-weight: 600;
            }
            /* Hide Ant Design pagination and extra UI controls when printing */
            .ant-pagination, 
            .ant-table-pagination, 
            .ant-table-footer,
            button {
              display: none !important;
            }
            @media print {
              button {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <h2>Transaction History</h2>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };