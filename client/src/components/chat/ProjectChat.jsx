import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Paperclip, User, Clock } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { formatDate } from '../../utils/formatters';

export const ProjectChat = ({ project }) => {
  const { user } = useAuth();
  const {
    messages,
    setMessages,
    joinProjectChat,
    sendProjectMessage,
    emitTyping,
    emitStopTyping,
    typingUsers,
  } = useSocket();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (project?._id) {
      joinProjectChat(project._id);
      fetchChatHistory();
    }
  }, [project?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/messages/${project._id}`);
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const receiverId =
      project.clientId?._id === user._id ? project.freelancerId?._id : project.clientId?._id;

    // Send real-time socket message
    sendProjectMessage(project._id, text, user._id, receiverId, user);

    // Save to persistent database
    try {
      await api.post(`/messages/${project._id}`, { text });
      setText('');
      emitStopTyping(project._id);
    } catch (err) {
      console.error('Failed to persist message:', err);
    }
  };

  const otherUser =
    project.clientId?._id === user?._id ? project.freelancerId : project.clientId;

  return (
    <div className="flex flex-col h-[520px] rounded-3xl border border-[#DED3E3] bg-[#FFFDF9] overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#DED3E3] bg-[#EEE6F5]/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={otherUser?.name || 'User'}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#9B83BD]/40"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#789B83] ring-2 ring-[#FFFDF9]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#302A35] leading-tight">
              {otherUser ? otherUser.name : 'Project Collaboration Channel'}
            </h4>
            <p className="text-[11px] text-[#6F6675] capitalize">
              {otherUser ? `${otherUser.role} • ${otherUser.title || 'Online'}` : 'Live Chat'}
            </p>
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#EEE6F5] border border-[#DED3E3] text-[#765B9E] font-mono font-semibold">
          ⚡ Socket.IO Live
        </span>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFFDF9]">
        {loading ? (
          <div className="text-center py-12 text-xs text-[#6F6675]">Loading live conversation...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquare className="w-10 h-10 text-[#9B83BD]/40 mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#302A35]">Start the project discussion</p>
            <p className="text-[11px] text-[#6F6675] mt-0.5">
              Discuss milestone specifications, design previews, and deliverable feedback in real time.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id;
            return (
              <div
                key={msg._id || idx}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderId?.avatar || otherUser?.avatar}
                    alt="avatar"
                    className="w-6 h-6 rounded-lg object-cover mb-1"
                  />
                )}
                <div
                  className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-[#9B83BD] text-white rounded-br-none shadow-[0_2px_10px_rgba(155,131,189,0.3)]'
                      : 'bg-[#EEE6F5] border border-[#DED3E3] text-[#302A35] rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 font-mono text-right ${
                      isMe ? 'text-white/80' : 'text-[#6F6675]'
                    }`}
                  >
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <div className="px-4 py-1.5 text-[10px] text-[#765B9E] italic flex items-center gap-1.5 bg-[#EEE6F5] border-t border-[#DED3E3]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9B83BD] animate-ping" />
          {Array.from(typingUsers).join(', ')} is typing...
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-[#DED3E3] bg-[#FFFDF9] flex items-center gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value) emitTyping(project._id, user.name);
            else emitStopTyping(project._id);
          }}
          onBlur={() => emitStopTyping(project._id)}
          placeholder={`Message ${otherUser?.name?.split(' ')[0] || 'collaborator'}...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DED3E3] text-xs text-[#302A35] placeholder-[#968D99] focus:outline-none focus:border-[#9B83BD]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2.5 rounded-xl bg-[#9B83BD] hover:bg-[#8F78B5] text-white shadow-sm disabled:opacity-40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
