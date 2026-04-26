export const NODE_W = 220;
export const NODE_H_BASE = 120;

export const DEFAULT_FLOW = {
  nodes: [
    { id: "n1", type: "start", question: "👋 Welcome! How can I help you today?", x: 300, y: 80, options: [
      { label: "Billing Issue", nextId: "n2" },
      { label: "Technical Support", nextId: "n3" },
      { label: "General Inquiry", nextId: "n4" }
    ]},
    { id: "n2", type: "mid", question: "What kind of billing issue are you experiencing?", x: 80, y: 280, options: [
      { label: "Incorrect charge", nextId: "n5" },
      { label: "Cancel subscription", nextId: "n6" }
    ]},
    { id: "n3", type: "mid", question: "What technical problem are you facing?", x: 320, y: 280, options: [
      { label: "App not loading", nextId: "n7" },
      { label: "Login issues", nextId: "n8" },
      { label: "Performance slow", nextId: "n9" }
    ]},
    { id: "n4", type: "mid", question: "What would you like to know?", x: 560, y: 280, options: [
      { label: "Pricing plans", nextId: "n10" },
      { label: "Contact sales", nextId: "n11" }
    ]},
    { id: "n5", type: "end", question: "✅ I've flagged your account for a billing review. Our team will contact you within 24 hours.", x: 0, y: 500, options: [] },
    { id: "n6", type: "end", question: "✅ Your cancellation has been initiated. You'll receive a confirmation email shortly.", x: 160, y: 500, options: [] },
    { id: "n7", type: "end", question: "🔧 Try clearing your cache and refreshing. If the issue persists, email support@flow.io.", x: 260, y: 500, options: [] },
    { id: "n8", type: "end", question: "🔐 Please reset your password using the 'Forgot Password' link on the login page.", x: 420, y: 500, options: [] },
    { id: "n9", type: "end", question: "⚡ We've noted performance issues. Our engineers are investigating. Thank you!", x: 580, y: 500, options: [] },
    { id: "n10", type: "end", question: "💰 Our plans start at $9/mo. Visit flowforge.io/pricing for full details.", x: 700, y: 500, options: [] },
    { id: "n11", type: "end", question: "📞 A sales representative will reach out within 1 business day. Thanks!", x: 860, y: 500, options: [] },
  ]
};
