let people = [];

$(document).ready(function() {
    $("#add-person").click(function() {
        const name = $("#person-name").val().trim();
        const paidRaw = $("#person-paid").val();
        const paid = parseFloat(paidRaw);

        if (!name || isNaN(paid)) {
            alert("Enter valid name and amount");
            return;
        }

        people.push({ name, paid: +paid });
        $("#people-list").append(`<li>${escapeHtml(name)} paid Rs ${paid.toFixed(2)}</li>`);

        $("#person-name").val("");
        $("#person-paid").val("");
        $("#result").empty();
    });

    $("#calculate-btn").click(function() {
        if (people.length === 0) {
            $("#result").html("<p>Add at least one person.</p>");
            return;
        }

        const total = people.reduce((sum, p) => sum + p.paid, 0);
        const share = total / people.length;

        const balances = people.map(p => ({
            name: p.name,
            balance: roundToTwo(p.paid - share)
        }));

        let output = `<p>Total Expense: Rs ${roundToTwo(total).toFixed(2)}</p>
                      <p>Each Person Should Pay: Rs ${roundToTwo(share).toFixed(2)}</p><hr>`;

        balances.forEach(b => {
            if (b.balance > 0) {
                output += `<p>${escapeHtml(b.name)} will receive Rs ${b.balance.toFixed(2)}</p>`;
            } else if (b.balance < 0) {
                output += `<p>${escapeHtml(b.name)} will pay Rs ${Math.abs(b.balance).toFixed(2)}</p>`;
            } else {
                output += `<p>${escapeHtml(b.name)} is settled.</p>`;
            }
        });

        const transactions = settleBalances(balances);
        if (transactions.length > 0) {
            output += `<hr><h4>Settle-up Transactions</h4><ul>`;
            transactions.forEach(t => {
                output += `<li>${escapeHtml(t.from)} pays ${escapeHtml(t.to)} Rs ${t.amount.toFixed(2)}</li>`;
            });
            output += `</ul>`;
        } else {
            output += `<p>No transactions needed — everyone is settled.</p>`;
        }

        $("#result").html(output);

        // 🎉 Confetti animation
        confetti({
            particleCount: 180,
            spread: 80,
            origin: { y: 0.75 }
        });
    });
});

function settleBalances(balances) {
    const debtors = [];
    const creditors = [];

    balances.forEach(b => {
        if (b.balance < -0.005) debtors.push({ name: b.name, amount: roundToTwo(-b.balance) });
        else if (b.balance > 0.005) creditors.push({ name: b.name, amount: roundToTwo(b.balance) });
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const transactions = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const transfer = Math.min(debtor.amount, creditor.amount);
        const tRounded = roundToTwo(transfer);

        transactions.push({ from: debtor.name, to: creditor.name, amount: tRounded });

        debtor.amount = roundToTwo(debtor.amount - tRounded);
        creditor.amount = roundToTwo(creditor.amount - tRounded);

        if (debtor.amount <= 0.005) i++;
        if (creditor.amount <= 0.005) j++;
    }

    return transactions;
}

function roundToTwo(x) {
    return Math.round((x + Number.EPSILON) * 100) / 100;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
