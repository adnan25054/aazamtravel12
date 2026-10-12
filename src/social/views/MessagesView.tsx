import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  ShieldCheck, 
  Circle, 
  ArrowLeft,
  Lock,
  Plus
} from 'lucide-react';
import { Conversation, DirectMessage, ConversationParticipant, SocialProfile } from '../types';
import { useSocialAuth } from '../context/SocialAuthContext';
import { socialApi } from '../lib/supabase';

export const MessagesView: React.FC = () => {
  const { currentUser } = useSocialAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<SocialProfile[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchConversations = async () => {
    try {
      const res = await socialApi.getConversations();
      const list: Conversation[] = res.conversations || [];
      setConversations(list);
      if (list.length > 0 && !activeConvId) {
        setActiveConvId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;

    const fetchMessages = async () => {
      try {
        const res = await socialApi.getMessages(activeConvId);
        setMessages(res.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();
  }, [activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvId || !newMessageText.trim() || sending) return;

    setSending(true);
    const content = newMessageText.trim();
    setNewMessageText('');

    try {
      const res = await socialApi.sendMessage(activeConvId, content);
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleStartNewChat = async (targetUserId: string) => {
    try {
      const res = await socialApi.startConversation(targetUserId, 'Hi there! Looking forward to connecting on Aazam Social.');
      setShowNewChatModal(false);
      fetchConversations();
      if (res.conversation) {
        setActiveConvId(res.conversation.id);
      }
    } catch (err) {
      alert('Failed to start chat: ' + err);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const otherParticipant = activeConversation?.participants.find(
    (p) => p.userId !== currentUser?.id
  ) || activeConversation?.participants[0];

  const filteredConversations = conversations.filter((c) => {
    const other = c.participants.find((p) => p.userId !== currentUser?.id);
    if (!other) return true;
    return (
      other.displayName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      other.username.toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden h-[82vh] max-h-[780px] grid grid-cols-1 md:grid-cols-12">
        {/* Left column: Conversation list (5 cols) */}
        <div className={`md:col-span-5 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full ${
          activeConvId ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <span>Direct Messages</span>
            </h2>

            <button
              type="button"
              onClick={async () => {
                setShowNewChatModal(true);
                const exp = await socialApi.getExplore().catch(() => ({ suggestedUsers: [] }));
                setAvailableUsers(exp.suggestedUsers || []);
              }}
              className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 transition-colors"
              title="New Message"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Conversations scroll area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading chats...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active conversations yet. Start a new chat!
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const partner = conv.participants.find((p) => p.userId !== currentUser?.id) || conv.participants[0];
                const isActive = conv.id === activeConvId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3 sm:p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-orange-50/70 dark:bg-orange-950/30 border-l-4 border-orange-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={partner?.avatarUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80'}
                        alt={partner?.displayName || 'User'}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      {partner?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 truncate">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {partner?.displayName || 'Traveler'}
                        </span>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {conv.lastMessage?.content || 'Started conversation'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Message thread & composer (7 cols) */}
        <div className={`md:col-span-7 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40 ${
          activeConvId ? 'flex' : 'hidden md:flex'
        }`}>
          {activeConversation && otherParticipant ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <img
                      src={otherParticipant.avatarUrl}
                      alt={otherParticipant.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-orange-500/20"
                    />
                    {otherParticipant.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {otherParticipant.displayName}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      @{otherParticipant.username} {otherParticipant.isOnline ? '· Active now' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px]">End-to-End Restricted</span>
                </div>
              </div>

              {/* Messages list */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p>No messages yet. Send a friendly greeting!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.senderId === currentUser?.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMine
                              ? 'bg-[#0B2545] text-white rounded-br-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={`Message @${otherParticipant.username}...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessageText.trim()}
                  className="p-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Your Direct Conversations
              </h4>
              <p className="text-xs max-w-xs">
                Select a conversation on the left or tap &ldquo;+&rdquo; to start messaging travel creators.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Start New Conversation
              </h3>
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleStartNewChat(u.id)}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl}
                      alt={u.displayName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {u.displayName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        @{u.username}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    Chat →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
