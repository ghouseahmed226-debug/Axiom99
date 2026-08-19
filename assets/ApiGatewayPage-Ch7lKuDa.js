import{a as y,r as n,j as e}from"./index-BEhArMjy.js";function v(){const{apiEndpoints:a,apiKeySimulated:o}=y(),[d,u]=n.useState(a[0]?.id||""),[r,h]=n.useState("curl"),[i,c]=n.useState(!1),[x,l]=n.useState(null),[b,p]=n.useState(!1),s=a.find(t=>t.id===d)||a[0],f=async()=>{c(!0),l(null),await new Promise(t=>setTimeout(t,600)),l(s.responseSample),c(!1)},m=()=>{const t=`https://axiom99.vercel.app${s.path}`;return r==="curl"?`curl -X ${s.method} "${t}" \\
  -H "Authorization: Bearer ${o}" \\
  -H "Content-Type: application/json" \\
  -d '${s.requestBodySample.replace(/\n/g,"")}'`:r==="python"?`import requests

url = "${t}"
headers = {
    "Authorization": "Bearer ${o}",
    "Content-Type": "application/json"
}
payload = ${s.requestBodySample}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`:r==="ts"?`const response = await fetch("${t}", {
  method: "${s.method}",
  headers: {
    "Authorization": "Bearer ${o}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${s.requestBodySample})
});
const data = await response.json();
console.log(data);`:`package main

import (
	"bytes"
	"net/http"
	"io/ioutil"
	"fmt"
)

func main() {
	url := "${t}"
	payload := []byte(\`${s.requestBodySample}\`)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer ${o}")
	client := &http.Client{}
	resp, _ := client.Do(req)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}`},g=()=>{navigator.clipboard.writeText(m()),p(!0),setTimeout(()=>p(!1),2e3)};return e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-[#121430] via-[#1a1c47] to-[#121430] p-6 shadow-2xl",children:e.jsx("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between gap-4",children:e.jsxs("div",{children:[e.jsx("span",{className:"inline-block rounded-full bg-indigo-500/20 border border-indigo-500/40 px-3 py-0.5 text-xs font-mono font-semibold text-indigo-300",children:"PROGRAMMATIC API GATEWAY //"}),e.jsx("h2",{className:"text-2xl font-bold text-white font-mono mt-1",children:"External REST API & Webhook Gateway"}),e.jsx("p",{className:"text-xs text-slate-300 mt-1 max-w-2xl",children:"Trigger any of the 99 agents, war room deliberations, or multi-agent mission workflows programmatically from external applications, GitHub Actions, or microservices."})]})})}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-6",children:[e.jsxs("div",{className:"lg:col-span-4 rounded-2xl border border-slate-800 bg-[#0d121f] p-5 space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-3",children:[e.jsx("h3",{className:"text-xs font-bold font-mono text-white tracking-wider",children:"SWARM REST ENDPOINTS"}),e.jsx("span",{className:"text-[10px] font-mono text-emerald-400",children:"HTTP/2 LIVE"})]}),e.jsx("div",{className:"space-y-2",children:a.map(t=>{const j=t.id===d;return e.jsxs("button",{onClick:()=>{u(t.id),l(null)},className:`w-full text-left p-3 rounded-xl font-mono text-xs transition ${j?"bg-indigo-950/50 border border-indigo-500/40 text-indigo-200":"hover:bg-slate-800/50 text-slate-400"}`,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold",children:t.method}),e.jsx("span",{className:"font-bold text-white truncate",children:t.path})]}),e.jsx("p",{className:"text-[11px] text-slate-400 mt-1 line-clamp-1",children:t.description})]},t.id)})}),e.jsxs("div",{className:"rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1 text-xs font-mono",children:[e.jsx("div",{className:"text-slate-400 text-[10px]",children:"Your API Secret Token:"}),e.jsx("div",{className:"text-cyan-400 font-bold truncate",children:o})]})]}),e.jsx("div",{className:"lg:col-span-8 space-y-4",children:e.jsxs("div",{className:"rounded-2xl border border-slate-800 bg-[#0d121f] p-6 space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono text-xs font-bold",children:s.method}),e.jsx("span",{className:"font-mono text-xs font-bold text-white",children:s.path})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"flex rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs font-mono",children:["curl","python","ts","go"].map(t=>e.jsx("button",{onClick:()=>h(t),className:`px-2.5 py-0.5 rounded uppercase font-bold transition ${r===t?"bg-indigo-500/30 text-indigo-300":"text-slate-500"}`,children:t},t))}),e.jsx("button",{onClick:g,className:"rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white transition",children:b?"✓ Copied":"📋 Copy"})]})]}),e.jsx("pre",{className:"rounded-xl border border-slate-800 bg-[#070a12] p-4 text-xs font-mono text-cyan-300 overflow-x-auto",children:m()}),e.jsx("div",{className:"flex justify-end",children:e.jsx("button",{onClick:f,disabled:i,className:"rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 transition",children:i?"Sending API Request...":"Send Live Request Test ⚡"})}),x&&e.jsxs("div",{className:"space-y-2 pt-2 border-t border-slate-800",children:[e.jsx("div",{className:"flex justify-between text-xs font-mono text-slate-400",children:e.jsxs("span",{children:["HTTP Response Status: ",e.jsx("span",{className:"text-emerald-400 font-bold",children:"200 OK (52ms)"})]})}),e.jsx("pre",{className:"rounded-xl border border-emerald-500/30 bg-[#061410] p-4 text-xs font-mono text-emerald-300 overflow-x-auto",children:x})]})]})})]})]})}export{v as default};
