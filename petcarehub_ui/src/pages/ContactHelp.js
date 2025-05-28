import React from 'react';

// PUBLIC_INTERFACE
function ContactHelp() {
  return (
    <div style={{padding: '0 1em', textAlign: 'center', maxWidth: 420, margin: '0 auto'}}>
      <div style={{fontSize: '2em', margin: '0.7em 0'}}>📞</div>
      <h3>Contact / Help</h3>
      <p>Contact support or access help resources.</p>
      <div style={{marginTop: '1.6em', color: 'var(--pch-accent)'}}>
        For help, email <a href="mailto:support@petcarehub.com" style={{color: 'var(--kavia-orange)'}}>support@petcarehub.com</a>
      </div>
    </div>
  );
}
export default ContactHelp;
