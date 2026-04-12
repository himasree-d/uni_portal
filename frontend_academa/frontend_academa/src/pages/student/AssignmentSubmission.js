import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiFileText, FiClock, FiCalendar, FiBookOpen,
  FiUser, FiUpload, FiCheckCircle, FiChevronLeft, FiAlertCircle
} from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const AssignmentSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(true);
  const token = localStorage.getItem('token');
  const h = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/assignments/${id}`, { headers: h })
      .then(r => r.json())
      .then(d => { if (d.success) setAssignment(d.data); })
      .catch(() => setError('Failed to load assignment'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setSubmitting(true); setError('');
    try {
      const form = new FormData();
      form.append('file', selectedFile);
      form.append('assignment_id', id);
      const res  = await fetch(`${API}/submissions`, { method:'POST', headers: h, body: form });
      const data = await res.json();
      if (!data.success) return setError(data.message || 'Submission failed');
      setSubmitted(true);
    } catch(e) { setError('Submission failed. Try again.'); }
    finally { setSubmitting(false); }
  };

  const colors = { primary:'#2563eb', secondary:'#3b82f6', bg:'#f0f9ff', card:'#fff', text:'#1e293b', light:'#64748b', border:'#e2e8f0', lightBg:'#f8fafc', success:'#10b981', error:'#ef4444' };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading assignment...</div>;
  if (!assignment) return (
    <div style={{backgroundColor:colors.bg,minHeight:'100vh',padding:'32px'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>
        <button style={{background:'none',border:'none',color:colors.primary,cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',marginBottom:'20px'}} onClick={()=>navigate('/student/assignments')}>
          <FiChevronLeft/> Back
        </button>
        <div style={{textAlign:'center',padding:'60px',background:colors.card,borderRadius:'20px',border:`1px solid ${colors.border}`}}>
          <FiAlertCircle size={48} style={{color:colors.error,marginBottom:'16px'}}/>
          <p style={{color:colors.text}}>Assignment not found.</p>
        </div>
      </div>
    </div>
  );

  if (submitted) return (
    <div style={{backgroundColor:colors.bg,minHeight:'100vh',padding:'32px'}}>
      <div style={{maxWidth:'600px',margin:'0 auto',textAlign:'center',paddingTop:'80px'}}>
        <div style={{background:colors.card,borderRadius:'24px',padding:'48px',border:`1px solid ${colors.border}`}}>
          <FiCheckCircle size={64} style={{color:colors.success,marginBottom:'20px'}}/>
          <h2 style={{fontSize:'24px',fontWeight:'700',color:colors.text,marginBottom:'10px'}}>Submitted Successfully!</h2>
          <p style={{color:colors.light,marginBottom:'28px'}}>Your assignment "{assignment.title}" has been submitted. You can track its status in the assignments page.</p>
          <button onClick={()=>navigate('/student/assignments')}
            style={{padding:'13px 28px',background:colors.primary,color:'white',border:'none',borderRadius:'12px',fontSize:'15px',fontWeight:'600',cursor:'pointer'}}>
            View All Assignments
          </button>
        </div>
      </div>
    </div>
  );

  const isOverdue = new Date() > new Date(assignment.due_date);

  return (
    <div style={{backgroundColor:colors.bg,minHeight:'100vh',padding:'32px'}}>
      <div style={{maxWidth:'1000px',margin:'0 auto'}}>
        <button style={{display:'flex',alignItems:'center',gap:'6px',background:'none',border:'none',color:colors.primary,fontSize:'15px',fontWeight:'500',cursor:'pointer',marginBottom:'24px'}}
          onClick={()=>navigate('/student/assignments')}>
          <FiChevronLeft/> Back to Assignments
        </button>

        <h1 style={{fontSize:'26px',fontWeight:'600',color:colors.text,marginBottom:'4px'}}>{assignment.title}</h1>
        <p style={{color:colors.light,marginBottom:'28px'}}>{assignment.course_name} ({assignment.course_code})</p>

        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'24px'}}>
          {/* Left: Details */}
          <div style={{background:colors.card,borderRadius:'20px',padding:'24px',border:`1px solid ${colors.border}`}}>
            <h2 style={{fontSize:'17px',fontWeight:'600',color:colors.text,marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
              <FiFileText color={colors.primary}/> Assignment Details
            </h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
              {[
                {icon:<FiUser/>,label:'Instructor',val:assignment.instructor_name},
                {icon:<FiCalendar/>,label:'Due Date',val:new Date(assignment.due_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})},
                {icon:<FiClock/>,label:'Due Time',val:assignment.due_time||'23:59'},
                {icon:<FiBookOpen/>,label:'Total Marks',val:assignment.total_marks},
              ].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'12px',background:colors.lightBg,display:'flex',alignItems:'center',justifyContent:'center',color:colors.primary}}>{item.icon}</div>
                  <div>
                    <div style={{fontSize:'12px',color:colors.light,marginBottom:'2px'}}>{item.label}</div>
                    <div style={{fontSize:'14px',fontWeight:'600',color:colors.text}}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {isOverdue && (
              <div style={{padding:'10px 16px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',color:'#dc2626',fontSize:'13px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
                <FiAlertCircle/> This assignment is overdue. Late submission will be marked as late.
              </div>
            )}

            {assignment.description && (
              <div style={{marginBottom:'20px'}}>
                <h3 style={{fontSize:'15px',fontWeight:'600',color:colors.text,marginBottom:'10px'}}>Description</h3>
                <p style={{color:colors.light,fontSize:'14px',lineHeight:'1.8',whiteSpace:'pre-line'}}>{assignment.description}</p>
              </div>
            )}
            {assignment.instructions && (
              <div>
                <h3 style={{fontSize:'15px',fontWeight:'600',color:colors.text,marginBottom:'10px'}}>Instructions</h3>
                <p style={{color:colors.light,fontSize:'14px',lineHeight:'1.8',whiteSpace:'pre-line'}}>{assignment.instructions}</p>
              </div>
            )}
          </div>

          {/* Right: Submit */}
          <div style={{background:colors.card,borderRadius:'20px',padding:'24px',border:`1px solid ${colors.border}`,height:'fit-content'}}>
            <h2 style={{fontSize:'17px',fontWeight:'600',color:colors.text,marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
              <FiUpload color={colors.primary}/> Submit Assignment
            </h2>

            {error && (
              <div style={{padding:'10px 14px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',color:'#dc2626',fontSize:'13px',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
                <FiAlertCircle size={14}/> {error}
              </div>
            )}

            {!selectedFile ? (
              <div style={{border:`2px dashed ${colors.border}`,borderRadius:'14px',padding:'32px',textAlign:'center',cursor:'pointer',marginBottom:'16px',transition:'all 0.2s'}}
                onClick={()=>document.getElementById('file-input').click()}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=colors.primary;e.currentTarget.style.background=colors.lightBg;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=colors.border;e.currentTarget.style.background='transparent';}}>
                <FiUpload size={32} style={{color:colors.primary,marginBottom:'10px'}}/>
                <div style={{fontSize:'14px',color:colors.text,marginBottom:'4px'}}>Click to select file</div>
                <div style={{fontSize:'12px',color:colors.light}}>PDF, DOC, ZIP, C, CPP, PY, JAVA (Max 10MB)</div>
                <input id="file-input" type="file" style={{display:'none'}} accept=".pdf,.doc,.docx,.zip,.c,.cpp,.py,.java,.txt"
                  onChange={e=>setSelectedFile(e.target.files[0])}/>
              </div>
            ) : (
              <div style={{padding:'14px',background:colors.lightBg,borderRadius:'12px',border:`1px solid ${colors.primary}`,marginBottom:'16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <FiFileText color={colors.primary}/>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:'500',color:colors.text}}>{selectedFile.name}</div>
                    <div style={{fontSize:'12px',color:colors.light}}>{(selectedFile.size/1024).toFixed(1)} KB</div>
                  </div>
                </div>
                <button onClick={()=>setSelectedFile(null)} style={{background:'none',border:'none',color:colors.error,cursor:'pointer',fontSize:'13px'}}>Remove</button>
              </div>
            )}

            <div style={{background:colors.lightBg,borderRadius:'10px',padding:'12px',marginBottom:'18px'}}>
              {['Submit only one file','Maximum file size: 10MB','Allowed: PDF, DOC, ZIP, C, CPP, PY, JAVA'].map((tip,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',color:colors.light,marginBottom:i<2?'6px':0}}>
                  <FiCheckCircle size={13} color={colors.success}/> {tip}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={!selectedFile||submitting}
              style={{width:'100%',padding:'13px',background:!selectedFile||submitting?'#ccc':colors.primary,color:'white',border:'none',borderRadius:'12px',fontSize:'15px',fontWeight:'600',cursor:!selectedFile||submitting?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 0.2s'}}>
              <FiUpload/> {submitting?'Submitting...':'Submit Assignment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssignmentSubmission;
