import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";


//http request
export const http = (accessToken = null) => {
  axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
  if (accessToken) {
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

// Print transactions history handler
// export const handlePrint = () => {
//   const printContent = printRef.current;
//   if (!printContent) return;

//   const printWindow = window.open('', '', 'width=900,height=650');
//   printWindow.document.write(`
//       <html>
//         <head>
//           <title>Transaction History</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 20px;
//             }
//             h2 {
//               text-align: center;
//               margin-bottom: 20px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 10px;
//             }
//             th, td {
//               border: 1px solid #ddd;
//               padding: 8px 12px;
//               text-align: left;
//               font-size: 13px;
//             }
//             th {
//               background-color: #f4f6f9;
//               font-weight: bold;
//             }
//             .credit {
//               color: green;
//               font-weight: 600;
//             }
//             .debit {
//               color: red;
//               font-weight: 600;
//             }
//             @media print {
//               button, form, .ant-pagination {
//                 display: none !important;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <h2>Transaction History</h2>
//           ${printContent.innerHTML}
//         </body>
//       </html>
//     `);
//   printWindow.document.close();
//   printWindow.focus();
//   printWindow.print();
//   printWindow.close();
// };

// Print transactions history handler
export const handlePrint = (data = []) => {
  if (!data.length) return alert("No transaction data found to print!");

  const printWindow = window.open('', '', 'width=900,height=650');
  
  // Generate table rows dynamically from data
  const rowsHTML = data.map((item) => `
    <tr>
      <td>${item.accountNumber || "-"}</td>
      <td>${item.branch || "-"}</td>
      <td><span class="${item.type}">${(item.type || "").toUpperCase()}</span></td>
      <td style="text-align: right;">Rs. ${Number(item.amount || 0).toLocaleString("en-IN")}</td>
      <td style="text-align: right;">Rs. ${Number(item.finalBalance || 0).toLocaleString("en-IN")}</td>
      <td>${item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
    </tr>
  `).join('');

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
            color: #333;
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
            background-color: #0066cc;
            color: white;
            font-weight: bold;
            text-align: center;
          }
          .credit {
            color: green;
            font-weight: 600;
          }
          .debit {
            color: red;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <h2>Bank Transactions Details</h2>
        <table>
          <thead>
            <tr>
              <th>Account No</th>
              <th>Branch</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Final Balance</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  
  // Give it a brief moment to render before triggering print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export const downloadTransaction = (data = []) => {
  if (!data.length) return alert("No transaction data found!");

  const doc = new jsPDF({ orientation: "landscape" }); // Landscape gives more room for extra columns
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const title = "Bank Transactions Details";
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - textWidth) / 2, 15);

  // Prepare table data including Final Balance and fixing the currency font
  const tableData = data.map((item) => [
    item.accountNumber || "-",
    item.branch || "-",
    (item.type || "").toUpperCase(),
    `Rs. ${Number(item.amount || 0).toLocaleString("en-IN")}`,
    `Rs. ${Number(item.finalBalance || 0).toLocaleString("en-IN")}`,
    item.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
  ]);

  // Add transactions table with Final Balance column
  autoTable(doc, {
    head: [["Account No", "Branch", "Type", "Amount", "Final Balance", "Date & Time"]],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: { halign: "center", fontSize: 9 },
    headStyles: { fillColor: [0, 102, 204], halign: "center" },
    columnStyles: { 
      3: { halign: "right" }, // Amount column
      4: { halign: "right" }  // Final Balance column
    },
  });

  // Calculate totals
  const totalCredit = data
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalDebit = data
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
  const balance = totalCredit - totalDebit;

  const finalY = doc.lastAutoTable.finalY + 10;

  // Totals summary table
  autoTable(doc, {
    startY: finalY,
    theme: "grid",
    head: [["Summary", "Amount"]],
    body: [
      ["Total Credit", `Rs. ${totalCredit.toLocaleString("en-IN")}`],
      ["Total Debit", `Rs. ${totalDebit.toLocaleString("en-IN")}`],
      ["Balance", `Rs. ${balance.toLocaleString("en-IN")}`],
    ],
    headStyles: { fillColor: [60, 179, 113], halign: "center" },
    styles: { halign: "right", fontStyle: "bold", fontSize: 10 },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "right" },
    },
  });

  // Save PDF
  doc.save("Bank_Transactions.pdf");
};