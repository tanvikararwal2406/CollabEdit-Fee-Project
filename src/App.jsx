import React, { useMemo, useState } from "react";
import {
  Bold, Italic, Underline, Undo2, Redo2, List, ListOrdered,
  Link as LinkIcon, MessageSquare, History, Share2, Save,
  ChevronDown, X, Send, Copy, Check, FileText
} from "lucide-react";
import "./App.css";

const initialComments = [
  { id: 1, user: "Prabhnoor", avatar: "P", time: "2 min ago", text: "This introduction looks good!" },
  { id: 2, user: "Sejal", avatar: "S", time: "5 min ago", text: "Maybe add one more example here." }
];

const initialVersions = [
  { id: 3, user: "Tanvi", action: "Updated the conclusion", time: "10:30 PM" },
  { id: 2, user: "Prabhnoor", action: "Added a new paragraph", time: "10:15 PM" },
  { id: 1, user: "Vani", action: "Created the document", time: "10:00 PM" }
];

const users = [
  { name: "Tanvi", avatar: "T", online: true, role: "Owner" },
  { name: "Prabhnoor", avatar: "P", online: true, role: "Editor" },
  { name: "Sejal", avatar: "S", online: true, role: "Viewer" },
  { name: "Vani", avatar: "V", online: true, role: "Viewer" }
];

function ToolbarButton({ children, onClick, title }) {
  return <button className="tool-btn" onClick={onClick} title={title}>{children}</button>;
}

function App() {
  const [title, setTitle] = useState("My Collaborative Document");
  const [saved, setSaved] = useState(true);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [permission, setPermission] = useState("Editor");
  const [copied, setCopied] = useState(false);
  const [versions, setVersions] = useState(initialVersions);
  const [editorHtml, setEditorHtml] = useState(`
    <h1>Welcome to CollabEdit</h1>
    <p>This is a <strong>frontend-only prototype</strong> of a collaborative rich-text editor.</p>
    <p>Start writing here. The interface demonstrates document editing, user presence, comments, version history and sharing controls.</p>
    <h2>Project goals</h2>
    <ul>
      <li>Simple and clean rich-text editing</li>
      <li>Show multiple users working together</li>
      <li>Keep the UI ready for future real-time collaboration</li>
    </ul>
  `);

  const wordCount = useMemo(() => {
    const text = editorHtml.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [editorHtml]);

  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    document.querySelector(".editor")?.focus();
    setSaved(false);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments([
      { id: Date.now(), user: "Tanvi", avatar: "T", time: "Just now", text: commentText.trim() },
      ...comments
    ]);
    setCommentText("");
  };

  const saveVersion = () => {
    setSaved(true);
    setVersions([
      { id: Date.now(), user: "Tanvi", action: "Saved a new version", time: "Just now" },
      ...versions
    ]);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText("https://example.com/collabedit/my-document");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleEditorInput = (e) => {
    setEditorHtml(e.currentTarget.innerHTML);
    setSaved(false);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><FileText size={20} /></div>
          <div>
            <div className="brand-name">CollabEdit</div>
            <div className="brand-subtitle">Collaborative workspace</div>
          </div>
        </div>

        <div className="title-wrap">
          <input
            className="document-title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
            aria-label="Document title"
          />
          <span className={saved ? "save-state" : "save-state unsaved"}>
            <span className="status-dot"></span>{saved ? "Saved" : "Unsaved changes"}
          </span>
        </div>

        <div className="top-actions">
          <div className="avatar-stack">
            {users.map((u) => (
              <div className={`avatar ${u.avatar.toLowerCase()}`} key={u.name} title={`${u.name} — ${u.role}`}>
                {u.avatar}<span className="online-dot"></span>
              </div>
            ))}
          </div>
          <button className="secondary-btn" onClick={() => setShowHistory(true)}>
            <History size={16} /> History
          </button>
          <button className="primary-btn" onClick={() => setShowShare(true)}>
            <Share2 size={16} /> Share
          </button>
        </div>
      </header>

      <div className="workspace">
        <main className="editor-area">
          <div className="toolbar">
            <ToolbarButton title="Bold" onClick={() => format("bold")}><Bold size={17} /></ToolbarButton>
            <ToolbarButton title="Italic" onClick={() => format("italic")}><Italic size={17} /></ToolbarButton>
            <ToolbarButton title="Underline" onClick={() => format("underline")}><Underline size={17} /></ToolbarButton>
            <div className="divider"></div>
            <select className="format-select" defaultValue="p" onChange={(e) => format("formatBlock", e.target.value)}>
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
            <div className="divider"></div>
            <ToolbarButton title="Bulleted list" onClick={() => format("insertUnorderedList")}><List size={18} /></ToolbarButton>
            <ToolbarButton title="Numbered list" onClick={() => format("insertOrderedList")}><ListOrdered size={18} /></ToolbarButton>
            <ToolbarButton title="Add link" onClick={() => {
              const url = window.prompt("Enter URL");
              if (url) format("createLink", url);
            }}><LinkIcon size={17} /></ToolbarButton>
            <div className="toolbar-spacer"></div>
            <ToolbarButton title="Undo" onClick={() => format("undo")}><Undo2 size={17} /></ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => format("redo")}><Redo2 size={17} /></ToolbarButton>
            <button className="save-btn" onClick={saveVersion}><Save size={16} /> Save</button>
          </div>

          <div className="document-wrap">
            <div className="paper">
              <div
                className="editor"
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                dangerouslySetInnerHTML={{ __html: editorHtml }}
              />
              <div className="fake-cursor cursor-rahul"><span>Prabhnoor</span></div>
              <div className="fake-cursor cursor-aman"><span>Sejal</span></div>
            </div>
          </div>

          <footer className="editor-footer">
            <span>{wordCount} words</span>
            <span>Frontend prototype · Collaboration is simulated</span>
          </footer>
        </main>

        <aside className="right-panel">
          <div className="panel-header">
            <div className="panel-tabs">
              <button className={showComments ? "tab active" : "tab"} onClick={() => setShowComments(true)}>
                <MessageSquare size={16} /> Comments <span>{comments.length}</span>
              </button>
              <button className={!showComments ? "tab active" : "tab"} onClick={() => setShowComments(false)}>
                <History size={16} /> Activity
              </button>
            </div>
          </div>

          {showComments ? (
            <div className="comments-panel">
              <div className="section-label">DISCUSSION</div>
              {comments.map((c) => (
                <div className="comment-card" key={c.id}>
                  <div className="comment-top">
                    <div className="mini-avatar">{c.avatar}</div>
                    <div>
                      <strong>{c.user}</strong>
                      <small>{c.time}</small>
                    </div>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))}
              <div className="comment-input-wrap">
                <textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                />
                <button onClick={addComment} title="Add comment"><Send size={16} /></button>
              </div>
            </div>
          ) : (
            <div className="activity-panel">
              <div className="section-label">RECENT ACTIVITY</div>
              {versions.slice(0, 5).map((v) => (
                <div className="activity-item" key={v.id}>
                  <div className="mini-avatar">{v.user[0]}</div>
                  <div><strong>{v.user}</strong><p>{v.action}</p><small>{v.time}</small></div>
                </div>
              ))}
            </div>
          )}

          <div className="presence">
            <div className="section-label">PEOPLE IN THIS DOCUMENT</div>
            {users.map((u) => (
              <div className="user-row" key={u.name}>
                <div className="mini-avatar">{u.avatar}<span className="presence-dot"></span></div>
                <div><strong>{u.name}</strong><small>{u.role}</small></div>
                <span className="online-label">Online</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {showShare && (
        <div className="modal-backdrop" onClick={() => setShowShare(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <div><h2>Share document</h2><p>Invite people to view or edit this document.</p></div>
              <button className="icon-close" onClick={() => setShowShare(false)}><X size={20} /></button>
            </div>
            <div className="share-input">
              <input placeholder="Enter email address" />
              <div className="permission-select">
                <select value={permission} onChange={(e) => setPermission(e.target.value)}>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
                <ChevronDown size={15} />
              </div>
              <button className="primary-btn">Invite</button>
            </div>
            <div className="share-link">
              <div><strong>Anyone with the link</strong><small>Demo sharing permission: {permission}</small></div>
              <button onClick={copyLink}>{copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy link</>}</button>
            </div>
            <div className="shared-users">
              <h3>People with access</h3>
              {users.map((u) => <div className="user-row" key={u.name}><div className="mini-avatar">{u.avatar}</div><div><strong>{u.name}</strong><small>{u.role}</small></div></div>)}
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="modal-backdrop" onClick={() => setShowHistory(false)}>
          <div className="modal history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <div><h2>Version history</h2><p>Saved versions of this document.</p></div>
              <button className="icon-close" onClick={() => setShowHistory(false)}><X size={20} /></button>
            </div>
            <div className="version-list">
              {versions.map((v, index) => (
                <div className="version-row" key={v.id}>
                  <div className="version-number">v{versions.length - index}</div>
                  <div><strong>{v.user}</strong><p>{v.action}</p></div>
                  <small>{v.time}</small>
                  <button className="restore-btn" onClick={() => setShowHistory(false)}>View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;