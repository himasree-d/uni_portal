import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiAward, FiTrendingUp, FiBookOpen } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const Grades = () => {
  const [grades, setGrades]   = useState([]);
  const [gpa, setGpa]         = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/grades/my-grades`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) { setGrades(d.data); setGpa(d.gpa); } })
      .finally(() => setLoading(false));
  }, []);

  const colors = { primary:'#2563eb', bg:'#f0f9ff', card:'#ffffff', text:'#1e293b', light:'#64748b', border:'#e2e8f0', lightBg:'#f8fafc' };
  const gradeColor = (g) => !g ? colors.light : g.startsWith('A') ? '#10b981' : g.startsWith('B') ? '#3b82f6' : g.startsWith('C') ? '#f59e0b' : '#ef4444';

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading grades...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiBarChart2 style={{color:colors.primary}}/> Grades & Performance
        </h1>
        <p style={{color:colors.light, marginBottom:'28px'}}>Track your academic performance</p>

        {/* GPA Cards */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'32px'}}>
          {[
            {icon:<FiAward/>, val: parseFloat(gpa?.gpa||0).toFixed(2), lbl:'Overall CGPA', bg:'#dbeafe', color:colors.primary},
            {icon:<FiTrendingUp/>, val: grades.length, lbl:'Courses Graded', bg:'#d1fae5', color:'#10b981'},
            {icon:<FiBookOpen/>, val: grades.reduce((s,g)=>s+(g.credits||0),0), lbl:'Total Credits', bg:'#fef3c7', color:'#f59e0b'},
          ].map((s,i) => (
            <div key={i} style={{background:colors.card, padding:'24px', borderRadius:'20px', border:`1px solid ${colors.border}`, display:'flex', alignItems:'center', gap:'16px'}}>
              <div style={{width:'52px', height:'52px', borderRadius:'16px', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>{s.icon}</div>
              <div><div style={{fontSize:'28px', fontWeight:'700', color:colors.text}}>{s.val}</div><div style={{fontSize:'14px', color:colors.light}}>{s.lbl}</div></div>
            </div>
          ))}
        </div>

        {/* Grades Table */}
        <div style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`}}>
          <h2 style={{fontSize:'18px', fontWeight:'600', color:colors.text, marginBottom:'20px'}}>Course Grades</h2>
          {grades.length === 0 ? (
            <div style={{textAlign:'center', padding:'40px', color:colors.light}}>
              <FiBarChart2 size={40} style={{opacity:0.3, marginBottom:'12px'}}/><p>No grades available yet.</p>
            </div>
          ) : (
            <>
              <div style={{display:'grid', gridTemplateColumns:'1fr 2.5fr 1fr 1.5fr 1.5fr 1.5fr', padding:'12px 16px', background:colors.lightBg, borderRadius:'12px', fontSize:'13px', fontWeight:'600', color:colors.text, marginBottom:'8px'}}>
                <span>Code</span><span>Course</span><span>Credits</span><span>Internal</span><span>External</span><span>Grade</span>
              </div>
              {grades.map(g => (
                <div key={g.id} style={{display:'grid', gridTemplateColumns:'1fr 2.5fr 1fr 1.5fr 1.5fr 1.5fr', padding:'16px', borderBottom:`1px solid ${colors.border}`, alignItems:'center', fontSize:'14px'}}
                  onMouseEnter={e=>e.currentTarget.style.background=colors.lightBg}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <span style={{fontWeight:'500', color:colors.primary}}>{g.code}</span>
                  <span style={{color:colors.text}}>{g.course_name}</span>
                  <span style={{color:colors.light}}>{g.credits}</span>
                  <span style={{color:colors.light}}>{g.internal_marks ? `${g.internal_marks}/50` : '—'}</span>
                  <span style={{color:colors.light}}>{g.external_marks ? `${g.external_marks}/50` : '—'}</span>
                  <span>
                    {g.grade ? (
                      <span style={{padding:'4px 12px', borderRadius:'30px', fontSize:'12px', fontWeight:'600', background:`${gradeColor(g.grade)}20`, color:gradeColor(g.grade)}}>
                        {g.grade} {g.grade_point ? `(${g.grade_point})` : ''}
                      </span>
                    ) : <span style={{color:colors.light}}>Pending</span>}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Grades;
