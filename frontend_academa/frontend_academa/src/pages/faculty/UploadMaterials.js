import React, { useState, useEffect } from 'react';
import { FiUpload, FiFileText, FiCheckCircle, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const UploadMaterials = () => {
  const [courses, setCourses]     = useState([]);
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ course_id:'', title:'', description:'' });
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  const load = () => {
    fetch(`${API}/courses/my-courses`, { headers: h }).then(r=>r.json()).then(d=>{ if(d.success) setCourses(d.data); });
    fetch(`${API}/materials`, { headers: h }).then(r=>r.json()).then(d=>{ if(d.success) setMaterials(d.data); });
  };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    setLoading(true); setResult(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('course_id', form.course_id);
    fd.append('title', form.title);
    fd.append('description', form.description);
    try {
      const res = await fetch(`${API}/materials`, { method:'POST', headers: h, body: fd });
      const data = await res.json();
      setResult(data);
      if (data.success) { setForm({ course_id:'', title:'', description:'' }); setFile(null); load(); }
    } catch(e) { setResult({ success:false, message:e.message }); }
    finally { setLoading(false); }
  };

  const deleteMaterial = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    await fetch(`${API}/materials/${id}`, { method:'DELETE', headers: h });
    load();
  };

  const colors = { primary:'#2563eb', bg:'#f0f9ff', card:'#ffffff', text:'#1e293b', light:'#64748b', border:'#e2e8f0', lightBg:'#f8fafc' };
  const inp = { width:'100%', padding:'12px 16px', border:`1px solid ${colors.border}`, borderRadius:'12px', fontSize:'14px', outline:'none', boxSizing:'border-box', background:'white' };
  const lbl = { display:'block', fontSize:'14px', fontWeight:'500', color:colors.text, marginBottom:'8px' };

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiUpload style={{color:colors.primary}}/> Upload Materials
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Share lecture notes, slides and resources with students</p>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>
          {/* Upload Form */}
          <div style={{background:colors.card, borderRadius:'24px', padding:'28px', border:`1px solid ${colors.border}`}}>
            <h2 style={{fontSize:'17px', fontWeight:'600', color:colors.text, marginBottom:'20px'}}>Upload New Material</h2>
            {result && (
              <div style={{padding:'12px 16px', borderRadius:'12px', marginBottom:'16px', background:result.success?'#f0fdf4':'#fef2f2', border:`1px solid ${result.success?'#bbf7d0':'#fecaca'}`, display:'flex', alignItems:'center', gap:'8px', color:result.success?'#15803d':'#dc2626', fontSize:'14px'}}>
                {result.success?<FiCheckCircle/>:<FiAlertCircle/>} {result.success?'Uploaded!':result.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:'16px'}}>
                <label style={lbl}>Course *</label>
                <select value={form.course_id} onChange={e=>setForm(p=>({...p,course_id:e.target.value}))} required style={{...inp}}>
                  <option value="">Select course</option>
                  {courses.map(c=><option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                </select>
              </div>
              <div style={{marginBottom:'16px'}}>
                <label style={lbl}>Title *</label>
                <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required placeholder="e.g. Lecture 1: Introduction" style={inp}/>
              </div>
              <div style={{marginBottom:'16px'}}>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2} placeholder="Optional description..." style={{...inp, resize:'vertical'}}/>
              </div>
              <div style={{marginBottom:'20px'}}>
                <label style={lbl}>File *</label>
                <div style={{border:`2px dashed ${colors.border}`, borderRadius:'14px', padding:'28px', textAlign:'center', cursor:'pointer'}}
                  onClick={()=>document.getElementById('mat-file').click()}>
                  <FiUpload size={28} style={{color:colors.primary, marginBottom:'8px'}}/>
                  <div style={{fontSize:'14px', color:colors.text}}>{file ? file.name : 'Click to choose file'}</div>
                  <div style={{fontSize:'12px', color:colors.light, marginTop:'4px'}}>PDF, DOC, DOCX, ZIP, etc.</div>
                  <input id="mat-file" type="file" style={{display:'none'}} onChange={e=>setFile(e.target.files[0])}/>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{width:'100%', padding:'13px', background:loading?'#ccc':colors.primary, color:'white', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'600', cursor:loading?'not-allowed':'pointer'}}>
                {loading ? 'Uploading...' : 'Upload Material'}
              </button>
            </form>
          </div>

          {/* Uploaded Materials */}
          <div style={{background:colors.card, borderRadius:'24px', padding:'28px', border:`1px solid ${colors.border}`}}>
            <h2 style={{fontSize:'17px', fontWeight:'600', color:colors.text, marginBottom:'20px'}}>Uploaded Materials ({materials.length})</h2>
            {materials.length === 0 ? (
              <div style={{textAlign:'center', padding:'40px', color:colors.light}}>
                <FiFileText size={40} style={{opacity:0.3, marginBottom:'12px'}}/><p>No materials uploaded yet.</p>
              </div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'10px', maxHeight:'500px', overflowY:'auto'}}>
                {materials.map(m => (
                  <div key={m.id} style={{padding:'14px', background:colors.lightBg, borderRadius:'14px', border:`1px solid ${colors.border}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'14px', fontWeight:'600', color:colors.text}}>{m.title}</div>
                      <div style={{fontSize:'12px', color:colors.light}}>{m.code||m.course_name} • {m.file_type?.toUpperCase()} • {m.file_size}</div>
                    </div>
                    <button onClick={()=>deleteMaterial(m.id)}
                      style={{padding:'6px', background:'#fee2e2', border:'none', borderRadius:'8px', color:'#ef4444', cursor:'pointer'}}>
                      <FiTrash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadMaterials;
