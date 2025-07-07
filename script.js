// Analytics Event Tracking
function trackEvent(action, category, label, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
}

let generatedCount = 1247892;
let savedPasswords = [];

// Length slider update
document.getElementById('length').addEventListener('input', function () {
    document.getElementById('lengthValue').textContent = this.value;
});

function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const numbers = document.getElementById('numbers').checked;
    const symbols = document.getElementById('symbols').checked;

    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        alert('Bitte wähle mindestens eine Zeichenart aus!');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('passwordDisplay').textContent = password;
    updateStrength(password);

    // Update counter with animation
    generatedCount++;
    document.getElementById('generatedCount').textContent = generatedCount.toLocaleString();

    // Analytics Event
    trackEvent('password_generated', 'engagement', 'generator_used', length);
}

function updateStrength(password) {
    let score = 0;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Length bonus
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set strength class and text
    strengthFill.className = 'strength-fill';
    if (score <= 3) {
        strengthFill.classList.add('strength-weak');
        strengthText.textContent = 'Schwach';
    } else if (score <= 5) {
        strengthFill.classList.add('strength-fair');
        strengthText.textContent = 'Mittelmäßig';
    } else if (score <= 6) {
        strengthFill.classList.add('strength-good');
        strengthText.textContent = 'Gut';
    } else {
        strengthFill.classList.add('strength-strong');
        strengthText.textContent = 'Sehr stark';
    }
}

function copyPassword() {
    const passwordText = document.getElementById('passwordDisplay').textContent;
    if (passwordText === 'Klicke auf "Neues Passwort" um zu starten...') {
        alert('Generiere zuerst ein Passwort!');
        return;
    }

    navigator.clipboard.writeText(passwordText).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Kopiert!';
        btn.style.background = '#27ae60';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

function analyzePassword() {
    const password = document.getElementById('testPassword').value;
    if (!password) {
        alert('Bitte gib ein Passwort ein!');
        return;
    }

    const analysis = performSecurityAnalysis(password);
    const resultDiv = document.getElementById('analysisResult');
    const hackTimeDiv = document.getElementById('hackTime');
    const detailsDiv = document.getElementById('securityDetails');

    // Dramatische Hack-Zeit Berechnung
    const hackTime = calculateHackTime(password);
    hackTimeDiv.textContent = `⚠️ Dein Passwort wäre in ${hackTime} gehackt!`;

    // Farbe basierend auf Sicherheit
    if (hackTime.includes('Sekunden') || hackTime.includes('Minuten')) {
        resultDiv.style.background = '#ffebee';
        resultDiv.style.border = '2px solid #f44336';
    } else if (hackTime.includes('Stunden') || hackTime.includes('Tage')) {
        resultDiv.style.background = '#fff3e0';
        resultDiv.style.border = '2px solid #ff9800';
    } else {
        resultDiv.style.background = '#e8f5e8';
        resultDiv.style.border = '2px solid #4caf50';
    }

    detailsDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
            <div><strong>Länge:</strong> ${password.length} Zeichen ${password.length >= 12 ? '✅' : '❌'}</div>
            <div><strong>Großbuchstaben:</strong> ${/[A-Z]/.test(password) ? '✅' : '❌'}</div>
            <div><strong>Kleinbuchstaben:</strong> ${/[a-z]/.test(password) ? '✅' : '❌'}</div>
            <div><strong>Zahlen:</strong> ${/[0-9]/.test(password) ? '✅' : '❌'}</div>
            <div><strong>Symbole:</strong> ${/[^A-Za-z0-9]/.test(password) ? '✅' : '❌'}</div>
            <div><strong>Häufige Wörter:</strong> ${containsCommonWords(password) ? '❌ Gefunden' : '✅'}</div>
        </div>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <strong>🎯 Sicherheits-Score:</strong> ${analysis.score}/10
            <div style="background: #e9ecef; height: 10px; border-radius: 5px; margin: 8px 0;">
                <div style="background: ${analysis.score >= 7 ? '#28a745' : analysis.score >= 4 ? '#ffc107' : '#dc3545'}; height: 100%; width: ${analysis.score * 10}%; border-radius: 5px;"></div>
            </div>
        </div>
    `;

    resultDiv.style.display = 'block';

    // Analytics Event
    trackEvent('security_check', 'engagement', 'password_analyzed', analysis.score);
}

function calculateHackTime(password) {
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^A-Za-z0-9]/.test(password)) charset += 32;

    const combinations = Math.pow(charset, password.length);
    const cracksPerSecond = 1000000000; // 1 Milliarde Versuche/Sekunde

    const seconds = combinations / (2 * cracksPerSecond);

    if (seconds < 60) return `${Math.round(seconds)} Sekunden`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} Minuten`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} Stunden`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} Tagen`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} Jahren`;
    return `${Math.round(seconds / 31536000000)} Jahrhunderten`;
}

function performSecurityAnalysis(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (!containsCommonWords(password)) score++;
    if (!/(.)\1{2,}/.test(password)) score++; // Keine Wiederholungen
    if (!/123|abc|qwe|password|admin/.test(password.toLowerCase())) score++;

    return { score: Math.min(score, 10) };
}

function containsCommonWords(password) {
    const common = ['password', 'admin', 'user', 'login', '123456', 'qwerty', 'welcome', 'monkey', 'letmein', 'dragon'];
    return common.some(word => password.toLowerCase().includes(word));
}

function addPassword() {
    const website = document.getElementById('websiteName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('websitePassword').value;

    if (!website || !username || !password) {
        alert('Bitte fülle alle Felder aus!');
        return;
    }

    const passwordEntry = {
        id: Date.now(),
        website: website,
        username: username,
        password: password,
        created: new Date().toLocaleDateString()
    };

    savedPasswords.push(passwordEntry);
    updatePasswordList();

    // Clear form
    document.getElementById('websiteName').value = '';
    document.getElementById('username').value = '';
    document.getElementById('websitePassword').value = '';

    // Show limitation after 3 entries
    if (savedPasswords.length >= 3) {
        alert('🚫 Demo-Limit erreicht!\n\n💎 In SecurePass Pro kannst du unbegrenzt Passwörter speichern und sie werden verschlüsselt in der Cloud gesichert.');
    }
}

function updatePasswordList() {
    const listDiv = document.getElementById('passwordList');
    if (savedPasswords.length === 0) {
        listDiv.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Noch keine Passwörter gespeichert</p>';
        return;
    }

    listDiv.innerHTML = savedPasswords.map(entry => `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #667eea;">
            <div style="display: flex; justify-content: between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="flex: 1;">
                    <strong>🌐 ${entry.website}</strong><br>
                    <small>👤 ${entry.username} | 📅 ${entry.created}</small>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="showPassword(${entry.id})" style="padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">👁️ Anzeigen</button>
                    <button onclick="removePassword(${entry.id})" style="padding: 5px 10px; border: 1px solid #dc3545; border-radius: 4px; background: #dc3545; color: white; cursor: pointer;">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showPassword(id) {
    const entry = savedPasswords.find(p => p.id === id);
    if (entry) {
        alert(`🔑 Passwort für ${entry.website}:\n\n${entry.password}\n\n💡 In der Premium-Version wird das Passwort sicher angezeigt und kann direkt kopiert werden.`);
    }
}

function removePassword(id) {
    savedPasswords = savedPasswords.filter(p => p.id !== id);
    updatePasswordList();
}

function checkDataBreach() {
    const email = document.getElementById('checkEmail').value;
    if (!email || !email.includes('@')) {
        alert('Bitte gib eine gültige Email-Adresse ein!');
        return;
    }

    const resultDiv = document.getElementById('breachResult');

    // Simuliere Laden
    resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;">🔍 Prüfe Datenlecks... <div style="margin-top: 10px;">⏳</div></div>';
    resultDiv.style.display = 'block';

    setTimeout(() => {
        // Simulierte Ergebnisse (in der echten App würde hier eine API-Abfrage stattfinden)
        const hasBreaches = Math.random() > 0.3; // 70% Chance für Datenlecks

        if (hasBreaches) {
            const breachCount = Math.floor(Math.random() * 5) + 1;
            resultDiv.innerHTML = `
                <div style="background: #ffebee; border: 2px solid #f44336; border-radius: 10px; padding: 20px;">
                    <h3 style="color: #d32f2f; margin-bottom: 15px;">🚨 ${breachCount} Datenleck(s) gefunden!</h3>
                    <div style="margin-bottom: 15px;">
                        <strong>Gefunden in:</strong><br>
                        ${generateRandomBreaches(breachCount)}
                    </div>
                    <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <strong>🛡️ Sofortige Maßnahmen:</strong><br>
                        ✅ Ändere alle Passwörter für betroffene Dienste<br>
                        ✅ Aktiviere 2-Faktor-Authentifizierung<br>
                        ✅ Überwache deine Accounts regelmäßig
                    </div>
                    <div style="text-align: center; margin-top: 15px;">
                        <button class="btn btn-premium" onclick="showPremiumModal('breach')">🛡️ Premium: Automatische Überwachung aktivieren</button>
                    </div>
                </div>
            `;
            // Analytics Event für gefundene Datenlecks
            trackEvent('breach_found', 'security', 'email_compromised', breachCount);
        } else {
            resultDiv.innerHTML = `
                <div style="background: #e8f5e8; border: 2px solid #4caf50; border-radius: 10px; padding: 20px; text-align: center;">
                    <h3 style="color: #2e7d32; margin-bottom: 15px;">✅ Keine Datenlecks gefunden!</h3>
                    <p>Deine Email-Adresse wurde in den geprüften Datenlecks nicht gefunden.</p>
                    <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 0.9rem;">
                        <strong>💡 Tipp:</strong> Mit Premium überwachen wir 15.000+ Datenlecks und benachrichtigen dich sofort bei neuen Bedrohungen!
                    </div>
                </div>
            `;
            // Analytics Event für saubere Email
            trackEvent('breach_clean', 'security', 'email_safe', 0);
        }

        // Analytics Event für Datenleck-Check Nutzung
        trackEvent('breach_check', 'engagement', 'email_checked');
    }, 2000);
}

function generateRandomBreaches(count) {
    const breaches = ['LinkedIn (2012)', 'Adobe (2013)', 'Yahoo (2014)', 'Dropbox (2012)', 'MySpace (2013)', 'Tumblr (2013)', 'Last.fm (2012)', 'Canva (2019)'];
    return breaches.slice(0, count).map(breach => `• ${breach}`).join('<br>');
}

function showPremiumModal(type = 'monthly') {
    let content = '';
    if (type === 'yearly') {
        content = `
            <h3>🎯 Jahres-Abo (Bestseller!)</h3>
            <div style="font-size: 2rem; color: #27ae60; margin: 15px 0;"><strong>49€/Jahr</strong> <span style="font-size: 1rem; color: #666;">(statt 59,88€)</span></div>
            <p>✅ Spare 17% | ✅ 2 Monate gratis | ✅ Alle Premium-Features</p>
            <br>
            <button class="btn btn-premium" onclick="redirectToPayment('yearly')">💳 Jetzt für 49€/Jahr upgraden</button>
        `;
    } else if (type === 'breach') {
        content = `
            <h3>🚨 Schütze dich vor Datenlecks!</h3>
            <div style="font-size: 1.5rem; color: #e74c3c; margin: 15px 0;">Deine Daten sind bereits kompromittiert!</div>
            <p><strong>Mit Premium erhältst du:</strong><br>
            🔍 Überwachung von 15.000+ Datenlecks<br>
            📧 Sofortige Email-Benachrichtigungen<br>
            📊 Detaillierte Sicherheits-Reports<br>
            🛡️ Proaktiver Schutz für die Zukunft</p>
            <br>
            <button class="btn btn-premium" onclick="redirectToPayment('monthly')">🛡️ Jetzt schützen - 4,99€/Monat</button>
        `;
    } else {
        content = `
            <h3>🌟 Premium-Upgrade</h3>
            <p>Schalte alle Sicherheits-Features frei!</p>
            <div style="font-size: 1.5rem; color: #667eea; margin: 15px 0;"><strong>4,99€/Monat</strong></div>
            <p>✅ Passwort-Manager | ✅ Datenleck-Überwachung | ✅ Mobile Apps</p>
            <br>
            <button class="btn btn-premium" onclick="redirectToPayment('monthly')">💳 Jetzt upgraden</button>
        `;
    }

    document.getElementById('premiumModal').innerHTML = `
        <div style="background:white; padding:40px; border-radius:20px; max-width:500px; text-align:center;">
            ${content}
            <br><br>
            <button class="btn btn-secondary" onclick="hidePremiumModal()">Später</button>
            <div style="margin-top: 15px; font-size: 0.8rem; color: #666;">
                🔒 Sichere Zahlung mit Stripe | 30 Tage Geld-zurück-Garantie
            </div>
        </div>
    `;
    document.getElementById('premiumModal').style.display = 'flex';

    // Analytics Event für Premium-Interest
    trackEvent('premium_modal_opened', 'conversion', type);
}

function redirectToPayment(plan) {
    // Hier würdest du zu deinem Stripe Payment Link weiterleiten
    if (plan === 'yearly') {
        alert('💳 Weiterleitung zu Stripe Payment:\n\nJahres-Abo: 49€\n\n(In der echten App würde hier der Stripe Checkout öffnen)');
        // window.location.href = 'https://buy.stripe.com/dein-yearly-link';
    } else {
        alert('💳 Weiterleitung zu Stripe Payment:\n\nMonats-Abo: 4,99€\n\n(In der echten App würde hier der Stripe Checkout öffnen)');
        // window.location.href = 'https://buy.stripe.com/dein-monthly-link';
    }
}

function hidePremiumModal() {
    document.getElementById('premiumModal').style.display = 'none';
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function () {
    generatePassword();
    updatePasswordList();

    // Add premium teasers
    document.querySelectorAll('.premium input').forEach(input => {
        input.addEventListener('click', function (e) {
            e.preventDefault();
            showPremiumModal();
        });
    });
});