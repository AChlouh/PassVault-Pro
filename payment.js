// PAYMENT.JS - Stripe Payment Logic
// Separate Datei für alle Payment-bezogenen Funktionen

// STRIPE PAYMENT INTEGRATION - Mit Test-URLs (funktionsfähig!)
function redirectToPayment(plan) {
    // Analytics Event für Payment-Interesse
    if (typeof trackEvent === 'function') {
        trackEvent('payment_redirect', 'conversion', plan, plan === 'yearly' ? 49 : 4.99);
    }

    // Stripe Payment Links (Test-Modus - funktioniert mit Test-Kreditkarten)
    if (plan === 'yearly') {
        // Yearly Abo - 49€/Jahr
        window.location.href = 'https://buy.stripe.com/test_14AbJ165RbLL0SF4Ep00000';
    } else {
        // Monthly Abo - 4,99€/Monat  
        window.location.href = 'https://buy.stripe.com/test_fZu9AT0Lx4jj30Nc6R00001';
    }
}

// Success-Handling (wenn Kunde zurückkommt nach erfolgreicher Zahlung)
function initializePaymentSuccess() {
    // Check if user came back from successful payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('premium') === 'success') {
        // Show success message
        showPaymentSuccess();
        // Track successful conversion
        if (typeof trackEvent === 'function') {
            trackEvent('payment_completed', 'conversion', 'successful_purchase');
        }
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function showPaymentSuccess() {
    // Create success modal
    document.body.insertAdjacentHTML('beforeend', `
        <div id="successModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center;">
            <div style="background:white; padding:40px; border-radius:20px; max-width:500px; text-align:center; animation: slideIn 0.5s ease;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🎉</div>
                <h2 style="color: #27ae60; margin-bottom: 15px;">Willkommen bei PassVault Pro!</h2>
                <p style="margin-bottom: 25px;">Deine Zahlung war erfolgreich. Du hast jetzt Zugang zu allen Premium-Features:</p>
                <div style="text-align: left; margin: 20px 0;">
                    <p>✅ Unbegrenzter Passwort-Manager</p>
                    <p>✅ 15.000+ Datenleck-Überwachung</p>
                    <p>✅ Mobile Apps (iOS & Android)</p>
                    <p>✅ Familie-Sharing (bis zu 5 Nutzer)</p>
                    <p>✅ Prioritäts-Support</p>
                </div>
                <button onclick="closeSuccessModal()" style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; border: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                    Los geht's! 🚀
                </button>
                <p style="font-size: 0.9rem; color: #666; margin-top: 20px;">
                    Du erhältst in Kürze eine Bestätigungs-Email mit deinen Zugangsdaten.
                </p>
            </div>
        </div>
    `);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
    }
}

// Enhanced Premium Modal mit echten Preisen und Stripe-Integration
function showPremiumModal(type = 'monthly') {
    let content = '';
    let ctaText = '';
    let price = '';

    if (type === 'yearly') {
        price = '49€/Jahr';
        ctaText = 'Jahres-Abo starten - 49€';
        content = `
            <h3>🎯 Jahres-Abo (Bestseller!)</h3>
            <div style="font-size: 2rem; color: #27ae60; margin: 15px 0;">
                <strong>49€/Jahr</strong> 
                <span style="font-size: 1rem; color: #666; text-decoration: line-through;">statt 59,88€</span>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <strong>💰 Du sparst 17% = 10,88€ pro Jahr!</strong>
            </div>
            <p>✅ Alle Premium-Features<br>✅ 2 Monate gratis<br>✅ Jederzeit kündbar</p>
        `;
    } else if (type === 'breach') {
        price = '4,99€/Monat';
        ctaText = 'Jetzt schützen - 4,99€/Monat';
        content = `
            <h3>🚨 Schütze dich vor Datenlecks!</h3>
            <div style="font-size: 1.5rem; color: #e74c3c; margin: 15px 0; font-weight: bold;">
                Deine Daten sind bereits kompromittiert!
            </div>
            <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0; border: 2px solid #f44336;">
                <strong>⚠️ SOFORTIGER Handlungsbedarf!</strong><br>
                Ohne Schutz werden weitere Ihrer Accounts kompromittiert.
            </div>
            <p><strong>Mit Premium erhältst du:</strong><br>
            🔍 Überwachung von 15.000+ Datenlecks<br>
            📧 Sofortige Email-Benachrichtigungen<br>
            📊 Detaillierte Sicherheits-Reports<br>
            🛡️ Proaktiver Schutz für die Zukunft</p>
        `;
    } else {
        price = '4,99€/Monat';
        ctaText = 'Premium starten - 4,99€/Monat';
        content = `
            <h3>🌟 Premium-Upgrade</h3>
            <p>Schalte alle Sicherheits-Features frei!</p>
            <div style="font-size: 2rem; color: #667eea; margin: 15px 0; font-weight: bold;">4,99€/Monat</div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
                <strong>Was du bekommst:</strong><br>
                ✅ Unbegrenzter Passwort-Manager<br>
                ✅ Datenleck-Überwachung (15.000+ DBs)<br>
                ✅ Mobile Apps (iOS & Android)<br>
                ✅ Familie-Sharing (5 Nutzer)<br>
                ✅ Export-Funktionen<br>
                ✅ Prioritäts-Support
            </div>
        `;
    }

    document.getElementById('premiumModal').innerHTML = `
        <div style="background:white; padding:40px; border-radius:20px; max-width:600px; text-align:center; animation: slideIn 0.3s ease;">
            ${content}
            
            <div style="margin: 30px 0;">
                <button class="btn btn-premium" onclick="redirectToPayment('${type === 'yearly' ? 'yearly' : 'monthly'}')" 
                        style="font-size: 1.2rem; padding: 18px 35px; width: 100%; margin-bottom: 15px;">
                    💳 ${ctaText}
                </button>
                
                ${type !== 'yearly' ?
            '<button class="btn" onclick="showPremiumModal(\'yearly\')" style="background: #27ae60; color: white; padding: 12px 25px; margin-bottom: 15px;">🎯 Lieber 17% sparen mit Jahres-Abo</button>'
            : ''
        }
            </div>
            
            <button class="btn btn-secondary" onclick="hidePremiumModal()" style="margin: 0 10px;">Später entscheiden</button>
            
            <div style="margin-top: 25px; font-size: 0.85rem; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
                <p><strong>🔒 100% sicher & vertrauenswürdig:</strong></p>
                <p>✅ SSL-verschlüsselte Zahlung mit Stripe<br>
                ✅ 30 Tage Geld-zurück-Garantie<br>
                ✅ Jederzeit online kündbar<br>
                ✅ Sofortiger Zugang nach Zahlung</p>
            </div>
        </div>
    `;
    document.getElementById('premiumModal').style.display = 'flex';

    // Analytics Event für Premium-Interest
    if (typeof trackEvent === 'function') {
        trackEvent('premium_modal_opened', 'conversion', type);
    }
}

function hidePremiumModal() {
    document.getElementById('premiumModal').style.display = 'none';
}

// CSS Animation für Modals (nur einmal hinzufügen)
function initializePaymentStyles() {
    // Check if styles already exist
    if (!document.getElementById('payment-styles')) {
        const style = document.createElement('style');
        style.id = 'payment-styles';
        style.textContent = `
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        `;
        document.head.appendChild(style);
    }
}

// Initialize payment functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePaymentStyles();
    initializePaymentSuccess();
});