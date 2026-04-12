import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUser, FiCalendar, FiClock, FiSearch } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API}/courses/my-courses`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setCourses(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.instructor_name||'').toLowerCase().includes(search.toLowerCase())
  );

  const colors = { primary:'#2563eb', bg:'#f0f9ff', card:'#ffffff', text:'#1e293b', light:'#64748b', border:'#e2e8f0', lightBg:'#f8fafc' };

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',color:colors.light}}>Loading courses...</div>;

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto'}}>
        <h1 style={{fontSize:'28px', fontWeight:'600', color:colors.text, marginBottom:'6px'}}>My Courses</h1>
        <p style={{color:colors.light, fontSize:'15px', marginBottom:'28px'}}>View and manage all your enrolled courses</p>

        <div style={{display:'flex', alignItems:'center', gap:'10px', background:colors.card, padding:'10px 18px', borderRadius:'14px', border:`1px solid ${colors.border}`, maxWidth:'400px', marginBottom:'28px'}}>
          <FiSearch color={colors.light}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses..." style={{border:'none', outline:'none', fontSize:'14px', width:'100%', background:'transparent'}}/>
        </div>

        {filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px', background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`}}>
            <FiBookOpen size={48} style={{opacity:0.3, marginBottom:'16px'}}/>
            <p style={{color:colors.light}}>{courses.length === 0 ? 'You are not enrolled in any courses yet.' : 'No courses match your search.'}</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px'}}>
            {filtered.map(c => (
              <div key={c.id} style={{background:colors.card, borderRadius:'24px', padding:'24px', border:`1px solid ${colors.border}`, cursor:'pointer', transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 20px 25px rgba(0,0,0,0.08)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
                onClick={()=>navigate(`/student/course/${c.id}`)}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                  <span style={{background:'#eef2ff', color:'#4f46e5', padding:'5px 12px', borderRadius:'30px', fontSize:'12px', fontWeight:'600'}}>{c.code}</span>
                  <span style={{color:colors.light, fontSize:'13px'}}>{c.credits} credits</span>
                </div>
                <h3 style={{fontSize:'17px', fontWeight:'600', color:colors.text, marginBottom:'8px'}}>{c.name}</h3>
                <div style={{display:'flex', alignItems:'center', gap:'6px', color:colors.light, fontSize:'13px', marginBottom:'16px'}}>
                  <FiUser size={13}/> {c.instructor_name}
                </div>
                <div style={{borderTop:`1px solid ${colors.border}`, paddingTop:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:colors.light}}>
                    <FiCalendar size={12}/> {c.schedule}
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:colors.light}}>
                    <FiClock size={12}/> {c.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyCourses;
