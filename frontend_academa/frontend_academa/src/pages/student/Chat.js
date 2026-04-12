import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiSearch, FiSend, FiUser, FiMoreVertical } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const Chat = () => {
  const [people, setPeople]           = useState([]);
  const [conversations, setConvs]     = useState([]);
  const [selectedUser, setSelected]   = useState(null);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [view, setView]               = useState('conversations'); // 'conversations' | 'people'
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const h     = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchConversations();
    fetchPeople();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
      // Poll for new messages every 3s
      pollRef.current = setInterval(() => fetchMessages(selectedUser.id), 3000);
    }
    return () => clearInterval(pollRef.current);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    const res  = await fetch(`${API}/chat/conversations`, { headers: h });
    const data = await res.json();
    if (data.success) setConvs(data.data);
  };

  const fetchPeople = async () => {
    const res  = await fetch(`${API}/chat/people`, { headers: h });
    const data = await res.json();
    if (data.success) setPeople(data.data);
  };

  const fetchMessages = async (userId) => {
    const res  = await fetch(`${API}/chat/messages/${userId}`, { headers: h });
    const data = await res.json();
    if (data.success) setMessages(data.data);
  };

  const selectUser = async (person) => {
    clearInterval(pollRef.current);
    setSelected(person);
    setMessages([]);
    await fetchMessages(person.id);
    fetchConversations(); // refresh unread count
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser || loading) return;
    setLoading(true);
    const text = input.trim();
    setInput('');
    try {
      const res  = await fetch(`${API}/chat/send`, {
        method:'POST', headers:{...h,'Content-Type':'application/json'},
        body: JSON.stringify({ receiver_id: selectedUser.id, message: text })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        fetchConversations();
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleKeyDown = e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const colors = { primary:'#2563eb', bg:'#f0f9ff', card:'#fff', text:'#1e293b', light:'#64748b', border:'#e2e8f0', lightBg:'#f8fafc' };

  const getInitials = name => name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';
  const getRoleColor = role => ({ admin:'#7c3aed', faculty:'#059669', student:'#2563eb' }[role] || '#64748b');

  const displayList = view === 'conversations'
    ? conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.department||'').toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{backgroundColor:colors.bg, minHeight:'100vh', padding:'24px'}}>
      <div style={{maxWidth:'1400px', margin:'0 auto'}}>
        <h1 style={{fontSize:'26px', fontWeight:'600', color:colors.text, marginBottom:'6px', display:'flex', alignItems:'center', gap:'10px'}}>
          <FiMessageSquare style={{color:colors.primary}}/> Messages
        </h1>
        <p style={{color:colors.light, marginBottom:'20px'}}>Chat with faculty and classmates</p>

        <div style={{display:'grid', gridTemplateColumns:'320px 1fr', gap:'20px', height:'calc(100vh - 180px)'}}>
          {/* Sidebar */}
          <div style={{background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {/* Search */}
            <div style={{padding:'16px', borderBottom:`1px solid ${colors.border}`}}>
              <div style={{display:'flex', gap:'8px', marginBottom:'12px'}}>
                <button onClick={()=>setView('conversations')}
                  style={{flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${view==='conversations'?colors.primary:colors.border}`, background:view==='conversations'?'#dbeafe':colors.lightBg, color:view==='conversations'?colors.primary:colors.light, fontSize:'13px', fontWeight:'600', cursor:'pointer'}}>
                  Chats
                </button>
                <button onClick={()=>setView('people')}
                  style={{flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${view==='people'?colors.primary:colors.border}`, background:view==='people'?'#dbeafe':colors.lightBg, color:view==='people'?colors.primary:colors.light, fontSize:'13px', fontWeight:'600', cursor:'pointer'}}>
                  People
                </button>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'8px', background:colors.lightBg, padding:'9px 13px', borderRadius:'10px', border:`1px solid ${colors.border}`}}>
                <FiSearch color={colors.light} size={14}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{border:'none', outline:'none', fontSize:'14px', width:'100%', background:'transparent'}}/>
              </div>
            </div>

            {/* List */}
            <div style={{flex:1, overflowY:'auto', padding:'8px'}}>
              {displayList.length === 0 ? (
                <div style={{textAlign:'center', padding:'40px 20px', color:colors.light}}>
                  <FiUser size={32} style={{opacity:0.3, marginBottom:'8px'}}/><p style={{fontSize:'13px'}}>{view==='conversations'?'No conversations yet.\nClick "People" to start chatting.':'No people found.'}</p>
                </div>
              ) : displayList.map(person => (
                <div key={person.id}
                  onClick={() => selectUser(person)}
                  style={{display:'flex', alignItems:'center', gap:'11px', padding:'11px 12px', borderRadius:'14px', cursor:'pointer', marginBottom:'4px', background:selectedUser?.id===person.id?'#dbeafe':'transparent', transition:'all 0.15s'}}
                  onMouseEnter={e=>{ if(selectedUser?.id!==person.id) e.currentTarget.style.background=colors.lightBg; }}
                  onMouseLeave={e=>{ if(selectedUser?.id!==person.id) e.currentTarget.style.background='transparent'; }}>
                  <div style={{width:'42px', height:'42px', borderRadius:'12px', background:getRoleColor(person.role), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'14px', flexShrink:0}}>
                    {getInitials(person.name)}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'14px', fontWeight:'600', color:colors.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{person.name}</span>
                      {person.last_message_time && <span style={{fontSize:'11px', color:colors.light, flexShrink:0, marginLeft:'4px'}}>{new Date(person.last_message_time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>}
                    </div>
                    <div style={{fontSize:'12px', color:colors.light, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                      {person.designation || person.department || person.role}
                    </div>
                    {person.last_message && <div style={{fontSize:'12px', color:colors.light, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{person.last_message}</div>}
                  </div>
                  {parseInt(person.unread_count) > 0 && (
                    <span style={{background:colors.primary, color:'white', fontSize:'11px', fontWeight:'700', padding:'2px 7px', borderRadius:'12px', flexShrink:0}}>
                      {person.unread_count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{background:colors.card, borderRadius:'20px', border:`1px solid ${colors.border}`, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {!selectedUser ? (
              <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:colors.light}}>
                <FiMessageSquare size={64} style={{opacity:0.2, marginBottom:'16px'}}/>
                <p style={{fontSize:'16px', fontWeight:'500'}}>Select a conversation to start messaging</p>
                <p style={{fontSize:'13px', marginTop:'4px'}}>Or click "People" to find someone to chat with</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{padding:'16px 20px', borderBottom:`1px solid ${colors.border}`, display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'42px', height:'42px', borderRadius:'12px', background:getRoleColor(selectedUser.role), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'14px'}}>
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <div style={{fontSize:'15px', fontWeight:'600', color:colors.text}}>{selectedUser.name}</div>
                    <div style={{fontSize:'12px', color:colors.light}}>{selectedUser.designation || selectedUser.department || selectedUser.role}</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:'10px', background:'#f8fafc'}}>
                  {messages.length === 0 ? (
                    <div style={{textAlign:'center', color:colors.light, marginTop:'40px'}}>
                      <p style={{fontSize:'14px'}}>No messages yet. Say hi! 👋</p>
                    </div>
                  ) : messages.map((msg, i) => {
                    const isMe = msg.sender_id === user.id;
                    const showDate = i===0 || new Date(messages[i-1].created_at).toDateString()!==new Date(msg.created_at).toDateString();
                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div style={{textAlign:'center', margin:'8px 0'}}>
                            <span style={{background:'white', padding:'4px 14px', borderRadius:'20px', fontSize:'12px', color:colors.light, border:`1px solid ${colors.border}`}}>
                              {new Date(msg.created_at).toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}
                            </span>
                          </div>
                        )}
                        <div style={{display:'flex', justifyContent:isMe?'flex-end':'flex-start'}}>
                          <div style={{maxWidth:'65%', padding:'11px 16px', borderRadius:isMe?'18px 18px 4px 18px':'18px 18px 18px 4px', background:isMe?colors.primary:'white', color:isMe?'white':colors.text, border:isMe?'none':`1px solid ${colors.border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.07)'}}>
                            <div style={{fontSize:'14px', lineHeight:'1.5', wordBreak:'break-word'}}>{msg.message}</div>
                            <div style={{fontSize:'11px', marginTop:'5px', textAlign:'right', opacity:0.7}}>
                              {new Date(msg.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef}/>
                </div>

                {/* Input */}
                <div style={{padding:'16px 20px', borderTop:`1px solid ${colors.border}`, background:'white'}}>
                  <div style={{display:'flex', gap:'12px', alignItems:'center', background:colors.lightBg, border:`1px solid ${colors.border}`, borderRadius:'14px', padding:'8px 12px'}}>
                    <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder={`Message ${selectedUser.name.split(' ')[0]}...`}
                      style={{flex:1, border:'none', outline:'none', fontSize:'14px', background:'transparent', color:colors.text}}/>
                    <button onClick={sendMessage} disabled={!input.trim() || loading}
                      style={{width:'38px', height:'38px', borderRadius:'10px', background:input.trim()?colors.primary:'#e2e8f0', border:'none', color:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:input.trim()?'pointer':'not-allowed', transition:'all 0.2s'}}>
                      <FiSend size={16}/>
                    </button>
                  </div>
                  <p style={{fontSize:'11px', color:colors.light, marginTop:'6px', textAlign:'center'}}>Press Enter to send</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
