import fs from 'fs';
import path from 'path';

// In-memory + File store for Blog Posts and Analytics fallback

const INITIAL_POSTS = [
  {
    id: "post-1",
    slug: "state-bank-of-india-act-1955",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "State Bank of India Act, 1955",
    author: "Prashant Jha",
    date: "November 1, 2025",
    readTime: "8 min read",
    comments: 0,
    views: 1420,
    published: true,
    excerpt: "Objective of the Act to establish the State Bank of India (SBI) as a public sector banking institution by taking over the business of the Imperial Bank of India...",
    content: `

<h3>STATE BANK OF INDIA ACT, 1955</h3>
<h3>INTRODUCTION</h3>
<p>Objective of the Act</p>
<p>To establish the State Bank of India (SBI) as a public sector banking institution by taking over the business of the Imperial Bank of India,<br/>
in order to extend banking facilities to rural and semi-urban areas and serve as an agent of the Reserve Bank of India (RBI) for government business.</p>
<p>Imperial Bank to SBI”</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Year</th><th>Event</th></tr></thead>
<tbody>

<tr>
<td>1806</td>
<td>Bank of Calcutta established</td>
</tr>
<tr>
<td>1921</td>
<td>Imperial Bank of India formed (merger of 3 Presidency Banks)</td>
</tr>
<tr>
<td>1935</td>
<td>RBI established</td>
</tr>
<tr>
<td>1947</td>
<td>India gained Independence</td>
</tr>
<tr>
<td>1951</td>
<td>Rural Credit Survey Committee recommended nationalization</td>
</tr>
<tr>
<td>1955</td>
<td>State Bank of India Act passed</td>
</tr>
<tr>
<td>1 July 1955</td>
<td>SBI formally started functioning</td>
</tr>
</tbody>
</table></div>

<h3>HISTORICAL BACKGROUND</h3>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Period</th><th>Development</th><th>Explanation</th></tr></thead>
<tbody>

<tr>
<td>Pre–1921</td>
<td>Presidency Banks</td>
<td>Three major banks: Bank of Bengal (1806), Bank of Bombay (1840), and Bank of Madras (1843).</td>
</tr>
<tr>
<td>1921</td>
<td>Formation of Imperial Bank of India</td>
<td>These three banks were merged under the Imperial Bank of India Act, 1920.Imperial Bank functioned as a commercial and quasi-central bank.</td>
</tr>
<tr>
<td>Post–Independence (1947–1955)</td>
<td>National Need</td>
<td>The Imperial Bank largely served urban and elite customers, neglecting rural credit and agricultural finance.</td>
</tr>
<tr>
<td>1955</td>
<td>Nationalization &amp; Establishment of SBI</td>
<td>Government nationalized the Imperial Bank under the State Bank of India Act, 1955, creating the State Bank of India on 1 July 1955.</td>
</tr>
</tbody>
</table></div>

<p>PREAMBLE (Essence)</p>
<p>“An Act to constitute the State Bank of India and to transfer to it the undertaking of the Imperial Bank of India, and to provide for other matters connected therewith or incidental thereto.”</p>
<p>Keywords:</p>
<ul>
<li>Constitution of SBI</li>
<li>Transfer of undertaking</li>
<li>Government ownership</li>
<li>Public purpose banking</li>
</ul>
<h3>AIMS AND OBJECTIVES</h3>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Objective</th><th>Explanation</th></tr></thead>
<tbody>

<tr>
<td>1. Nationalization of Imperial Bank</td>
<td>To bring banking under government control and align it with national interests.</td>
</tr>
<tr>
<td>2. Rural Expansion</td>
<td>To extend credit facilities to rural and semi-urban areas neglected by private banks.</td>
</tr>
<tr>
<td>3. Financial Inclusion</td>
<td>To make banking accessible to farmers, small businesses, and weaker sections.</td>
</tr>
<tr>
<td>4. Public Welfare Banking</td>
<td>To operate not just for profit, but for the economic development of the country.</td>
</tr>
<tr>
<td>5. Agency Role for RBI</td>
<td>To assist RBI in government business — managing accounts, issuing currency, handling public debt.</td>
</tr>
</tbody>
</table></div>

<h3>STRUCTURE OF THE ACT</h3>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Chapter</th><th>Subject</th><th>Key Focus Area</th></tr></thead>
<tbody>

<tr>
<td>I</td>
<td>Preliminary</td>
<td>Short title, definitions, commencement.</td>
</tr>
<tr>
<td>II</td>
<td>Incorporation &amp; Capital</td>
<td>Establishment, capital structure, legal personality.</td>
</tr>
<tr>
<td>III</td>
<td>Transfer of Undertaking</td>
<td>Transfer of assets, liabilities, and employees from Imperial Bank.</td>
</tr>
<tr>
<td>IV</td>
<td>Shares and Shareholders</td>
<td>Rights, voting, and government shareholding.</td>
</tr>
<tr>
<td>V</td>
<td>Management and Governance</td>
<td>Central Board, Chairman, MDs, and Local Boards.</td>
</tr>
<tr>
<td>VI</td>
<td>Business of the State Bank</td>
<td>Banking powers, limitations, and RBI agency role.</td>
</tr>
<tr>
<td>VII</td>
<td>Accounts, Audit, and Funds</td>
<td>Financial discipline, reserves, and reporting.</td>
</tr>
<tr>
<td>VIII</td>
<td>Miscellaneous</td>
<td>Administrative, legal, and transitional provisions.</td>
</tr>
</tbody>
</table></div>

<h3>LEGAL NATURE OF SBI</h3>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Feature</th><th>Meaning</th></tr></thead>
<tbody>

<tr>
<td>Body Corporate</td>
<td>SBI is a legal entity — can sue or be sued.</td>
</tr>
<tr>
<td>Government-Owned</td>
<td>Central Government must hold at least 51% of its share capital.</td>
</tr>
<tr>
<td>Statutory Bank</td>
<td>Created by a Parliamentary Act, not by company registration.</td>
</tr>
<tr>
<td>Public Purpose Institution</td>
<td>Works for national economic growth, not merely private profit.</td>
</tr>
</tbody>
</table></div>
<p>Imperial Bank vs. State Bank of India”</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Basis</th><th>Imperial Bank of India</th><th>State Bank of India</th></tr></thead>
<tbody>

<tr>
<td>Ownership</td>
<td>Private shareholders</td>
<td>Government-controlled (public sector)</td>
</tr>
<tr>
<td>Purpose</td>
<td>Profit-making</td>
<td>Public service and development</td>
</tr>
<tr>
<td>Rural Banking</td>
<td>Negligible</td>
<td>Primary focus area</td>
</tr>
<tr>
<td>Control</td>
<td>Managed by private Board</td>
<td>Managed by Central Board under Government</td>
</tr>
<tr>
<td>Year of Establishment</td>
<td>1921</td>
<td>1955</td>
</tr>
<tr>
<td>Legal Authority</td>
<td>Imperial Bank of India Act, 1920</td>
<td>State Bank of India Act, 1955</td>
</tr>
</tbody>
</table></div>

<p>Enactment:</p>
<ul>
<li>Name: State Bank of India Act, 1955</li>
<li>Act No.: 23 of 1955</li>
<li>Date of Enactment: 8 May 1955</li>
<li>Came into Force: 1 July 1955</li>
<li>Objective: To constitute the State Bank of India, to transfer to it the undertaking of the Imperial Bank of India, and to provide for matters connected therewith.</li>
</ul>

<h3>CHAPTER I – PRELIMINARY</h3>
<p>Section 1 – Short Title and Commencement</p>
<ol>
<li>Short Title:<br/>
The Act is called the State Bank of India Act, 1955.<br/>
→ This gives the official name of the legislation.</li>
<li>Commencement:
<ul>
<li>It came into force on 1st July, 1955,</li>
<li>by a notification of the Central Government in the Official Gazette.</li>
</ul>
</li>
</ol>
<p>Section 2 – Definitions</p>
<p>This section defines key terms used in the Act. Let’s simplify some of the most important ones:</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Term</th><th>Meaning (Simplified)</th></tr></thead>
<tbody>

<tr>
<td>Appointed Day</td>
<td>The day the Act came into force → 1st July, 1955.</td>
</tr>
<tr>
<td>Central Board</td>
<td>The main governing body of SBI, also called Central Board of Directors. It controls and directs all affairs of the bank.</td>
</tr>
<tr>
<td>Chairman</td>
<td>Head of the Central Board. The top executive authority of SBI.</td>
</tr>
<tr>
<td>Imperial Bank</td>
<td>The old bank formed in 1921, whose business was transferred to SBI.</td>
</tr>
<tr>
<td>Local Board</td>
<td>Smaller boards constituted under Section 21 for different regions (e.g., Mumbai, Kolkata, Chennai).</td>
</tr>
<tr>
<td>Reserve Bank</td>
<td>Reserve Bank of India (RBI) established under RBI Act, 1934.</td>
</tr>
<tr>
<td>State Bank</td>
<td>Means the State Bank of India constituted under this Act.</td>
</tr>
<tr>
<td>Workman</td>
<td>Has the same meaning as in the Industrial Disputes Act, 1947 — includes non-managerial employees engaged in manual or clerical work.</td>
</tr>
</tbody>
</table></div>
<p>💡 Purpose of Definitions:<br/>
These terms create clarity and consistency in interpretation throughout the Act.</p>

<p>CHAPTER II – INCORPORATION &amp; SHARE CAPITAL (Sections 3–5)</p>
<p>Objective of Chapter II</p>
<p>To provide the legal foundation for the establishment of the State Bank of India (SBI) and to define its capital structure, ownership, and basic corporate character.</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Section No.</th><th>Section Title</th><th>Core Provision / Meaning</th></tr></thead>
<tbody>

<tr>
<td>3</td>
<td>Establishment of the State Bank of India</td>
<td>• Constitutes the State Bank of India as a body corporate.<br/>
• SBI has perpetual succession and a common seal.<br/>
• It can sue and be sued in its own name.<br/>
• Central Office to be at Mumbai (Bombay).</td>
</tr>
<tr>
<td>4</td>
<td>Authorised Capital of the State Bank</td>
<td>• Total authorised capital of SBI shall be ₹5,000 crore, divided into 500 crore shares of ₹10 each.<br/>
• Capital may be increased or reduced by the Central Government, in consultation with RBI, through notification.<br/>
• Shares may be issued in physical or dematerialized form.</td>
</tr>
<tr>
<td>5</td>
<td>Issued Capital and Government Holding</td>
<td>• The Central Government must always hold not less than 51% of the issued capital of SBI.<br/>
• The remaining shares may be held by the public, financial institutions, or others.<br/>
• Shares are freely transferable, subject to rules.</td>
</tr>
</tbody>
</table></div>
<p>CHAPTER III – TRANSFER OF UNDERTAKING (Sections 6–9)</p>
<p>Objective of Chapter III</p>
<p>To legally transfer the business, assets, liabilities, and employees of the Imperial Bank of India (1921–1955) to the newly established State Bank of India, ensuring continuity, employee protection, and public ownership.</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Section No.</th><th>Section Title</th><th>Core Provision / Meaning</th></tr></thead>
<tbody>

<tr>
<td>6</td>
<td>Transfer of Assets and Liabilities</td>
<td>• On the appointed day (1 July 1955), all assets, liabilities, contracts, and undertakings of the Imperial Bank automatically transfer to SBI.<br/>
• No separate conveyance, deed, or assignment needed.<br/>
• All legal proceedings by or against the Imperial Bank continue against SBI.</td>
</tr>
<tr>
<td>7</td>
<td>Transfer of Service of Employees</td>
<td>• All employees of the Imperial Bank automatically become employees of SBI on the same terms and conditions.<br/>
• No break in service or loss of benefits (salary, pension, leave, etc.).<br/>
• Employees cannot claim compensation merely because of the transfer.</td>
</tr>
<tr>
<td>8</td>
<td>Provident and Pension Funds</td>
<td>• All provident funds, pension funds, gratuity funds, and other staff welfare funds maintained by the Imperial Bank are transferred to SBI.<br/>
• Funds continue to be managed for the same purpose and benefit of staff.</td>
</tr>
<tr>
<td>9</td>
<td>Compensation to Shareholders</td>
<td>• Shareholders of the Imperial Bank are compensated for the transfer of their shares and interests.<br/>
• Compensation is calculated as per First Schedule of the Act.<br/>
• Payment method decided by the Central Government.</td>
</tr>
</tbody>
</table></div>
<p>CHAPTER IV – SHARES AND SHAREHOLDERS (Sections 10–15)</p>
<p>Objective of Chapter IV</p>
<p>To define the ownership structure, rights, and obligations of shareholders of the State Bank of India (SBI).<br/>
This Chapter regulates transfer, voting, nomination, and recognition of shares, ensuring government control and investor protection.</p>

<div class="table-responsive"><table class="blog-table"><thead><tr><th>Sec. No.</th><th>Section Title</th><th>Core Provision / Meaning</th></tr></thead>
<tbody>

<tr>
<td>10</td>
<td>Transferability of Shares</td>
<td>• Shares of SBI are transferable, subject to rules framed by the Central Government and RBI.<br/>
• The transfer must be registered in the books of SBI.<br/>
• Transfer does not affect the Government’s minimum 51% shareholding.</td>
</tr>
<tr>
<td>10A</td>
<td>Nomination</td>
<td>• A shareholder can nominate any person to whom shares will vest after their death.<br/>
• Nominee becomes entitled to all rights upon shareholder’s death.<br/>
• Nomination can be cancelled or varied at any time.</td>
</tr>
<tr>
<td>11</td>
<td>Voting Rights of Shareholders</td>
<td>• Each shareholder has one vote per share held.<br/>
• However, no shareholder other than the Central Government can exercise voting rights exceeding 10% of total voting rights.<br/>
• Voting may be in person or by proxy.</td>
</tr>
<tr>
<td>12</td>
<td>Shares as Approved Securities</td>
<td>• Shares of SBI are deemed “approved securities”under the Indian Trusts Act, 1882 and the Insurance Act, 1938.<br/>
• This makes them eligible investments for trust funds, insurance companies, and other statutory bodies.</td>
</tr>
<tr>
<td>13</td>
<td>Register of Shareholders</td>
<td>• SBI must maintain a Register of Shareholders, containing names, addresses, and shareholdings.<br/>
• Inspection of the register is allowed as per regulations.</td>
</tr>
<tr>
<td>13A</td>
<td>Register of beneficial owner</td>
<td>The register of beneficial owners maintained by depository under section 11 of depositories act 1996 shall be deemed to be a register of shareholders for the purpose of this act</td>
</tr>
<tr>
<td>15</td>
<td>Trusts Not Recognized</td>
<td>• SBI will not recognize any trust (public or private) relating to its shares.<br/>
• Only the registered holder is recognized as the shareholder for all purposes.</td>
</tr>
</tbody>
</table></div>

<p>CHAPTER V – MANAGEMENT (Sections 16–31A)</p>
<p>Objective of Chapter V</p>
<p>To lay down the organizational structure, composition, powers, and working of the Central and Local Boards of the State Bank of India (SBI).<br/>
This chapter governs who manages the Bank, how they are appointed, their powers, tenure, and meeting procedures.</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Sec. No.</th><th>Section Title</th><th>Core Provision / Meaning</th></tr></thead>
<tbody>

<tr>
<td>16</td>
<td>Offices and Branches</td>
<td>• SBI shall have its Central Office at Mumbai (Bombay).<br/>
• It may establish local head offices, branches, and agencies in India or abroad.<br/>
• Opening or closing offices requires RBI approval.</td>
</tr>
<tr>
<td>17</td>
<td>Management of SBI</td>
<td>• The general superintendence and directionof the bank’s affairs vest in the Central Board of Directors.<br/>
• The Chairman is the Chief Executive Officer (CEO).</td>
</tr>
<tr>
<td>18</td>
<td>Directions by Central Government</td>
<td>• The Central Government, after consultation with RBI, may issue policy directions to SBI in the public interest.<br/>
• SBI is bound to comply.</td>
</tr>
<tr>
<td>19</td>
<td>Constitution of Central Board</td>
<td>• The Central Board consists of:<br/>
1. Chairman<br/>
2. Managing Directors (up to 4)<br/>
3. Official directors (nominated by Govt. and RBI)<br/>
4. Non-official directors (elected shareholders, employee representatives, etc.)<br/>
• Total strength and representation prescribed by law.</td>
</tr>
<tr>
<td>19A</td>
<td>Qualifications of Directors</td>
<td>• Directors must possess adequate banking, finance, or business experience.<br/>
• Persons of unsound mind, insolvent, or convicted of offence are disqualified.</td>
</tr>
<tr>
<td>19B</td>
<td>Additional Directors</td>
<td>• RBI may appoint one or more additional directors on the Central Board in the interest of banking policy or public interest.</td>
</tr>
<tr>
<td>20</td>
<td>Term of Office</td>
<td>• Term of office for directors, Chairman, and MDs fixed by Govt. (usually 3 years, extendable).<br/>
• They may resign, retire, or be removedearlier by Govt.</td>
</tr>
<tr>
<td>21</td>
<td>Local Boards</td>
<td>• SBI may establish Local Boards for specified areas.<br/>
• Members appointed by Central Board with Govt. approval.<br/>
• They advise on local banking needs.</td>
</tr>
<tr>
<td>21A</td>
<td>Powers of Local Boards</td>
<td>• Local Boards perform functions delegated by Central Board.<br/>
• Mostly advisory — on local lending, rural banking, etc.</td>
</tr>
<tr>
<td>21B</td>
<td>Committees of Local Boards</td>
<td>• Local Boards may form committees to handle specific functions.<br/>
• Subject to Central Board’s supervision.</td>
</tr>
<tr>
<td>21C</td>
<td>Advisory Committee for Associates</td>
<td>• SBI may constitute Advisory Committees to guide operations of associate banks or local matters.</td>
</tr>
<tr>
<td>22</td>
<td>Disqualifications of Directors</td>
<td>• Disqualified if:<br/>
1. Of unsound mind or insolvent<br/>
2. Convicted of moral turpitude<br/>
3. Holds conflicting office or interest<br/>
4. Misses meetings without valid reason</td>
</tr>
<tr>
<td>23</td>
<td>Vacation of Office</td>
<td>• Director vacates office if disqualified, resigns, or becomes ineligible.</td>
</tr>
<tr>
<td>24A</td>
<td>Supersession of Central Board</td>
<td>• Central Government may supersede the Central Board in public interest, after consultation with RBI.<br/>
• During supersession, Govt. appoints interim administrators.</td>
</tr>
<tr>
<td>25</td>
<td>Casual Vacancies</td>
<td>• Mid-term vacancies filled in same manner as original appointment.<br/>
• Replacement serves only remainder of predecessor’s term.</td>
</tr>
<tr>
<td>26</td>
<td>Remuneration of Directors</td>
<td>• Govt. fixes fees, allowances, and remuneration of directors, Chairman, and MDs (in consultation with RBI).</td>
</tr>
<tr>
<td>27</td>
<td>Powers and Remuneration of Chairman</td>
<td>• Chairman = Chief Executive Officer (CEO).<br/>
• Oversees day-to-day management.<br/>
• Salary and powers fixed by Govt. + RBI.</td>
</tr>
<tr>
<td>28</td>
<td>[Omitted]</td>
<td>Deleted by later amendment.</td>
</tr>
<tr>
<td>29</td>
<td>Powers and Remuneration of Managing Directors</td>
<td>• MDs assist Chairman in executing policies.<br/>
• Powers and pay fixed by Govt. + RBI.</td>
</tr>
<tr>
<td>30</td>
<td>Executive and Other Committees</td>
<td>• Central Board may form committees (Executive, Audit, etc.) for specific functions.</td>
</tr>
<tr>
<td>31</td>
<td>Meetings of Central Board</td>
<td>• Board meets regularly as per regulations.<br/>
• Decisions by majority; Chairman has casting vote.</td>
</tr>
<tr>
<td>31A</td>
<td>Meetings of Local Boards</td>
<td>• Local Boards meet periodically to discuss regional banking issues.<br/>
• Their reports go to the Central Board.</td>
</tr>
</tbody>
</table></div>
<p>Two-tier Management System</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Level</th><th>Body</th><th>Main Function</th></tr></thead>
<tbody>

<tr>
<td>Central Level</td>
<td>Central Board of Directors</td>
<td>Overall policy, supervision, and management.</td>
</tr>
<tr>
<td>Regional Level</td>
<td>Local Boards</td>
<td>Advisory and local implementation.</td>
</tr>
</tbody>
</table></div>
<p>Executive Hierarchy</p>
<p>Chairman → Managing Directors → Committees → Regional/Local Boards.</p>
<p>CHAPTER VI – BUSINESS OF THE STATE BANK (Sections 32–35)</p>
<p>Objective of Chapter VI</p>
<p>To define the functions, powers, and limitations of the State Bank of India in conducting its banking business, and to specify its role as the agent of the Reserve Bank of India (RBI).</p>
<p>This chapter ensures that SBI operates both as a commercial bank and as a public sector institution serving national financial objectives.</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Sec. No.</th><th>Section Title</th><th>Core Provision / Meaning</th></tr></thead>
<tbody>

<tr>
<td>32</td>
<td>State Bank to Act as Agent of the Reserve Bank</td>
<td>• SBI acts as the agent of RBI wherever RBI requires.<br/>
• Performs functions like:<br/>
→ Managing Government business(receipts, payments, public debt).<br/>
→ Conducting currency and remittance services.<br/>
• RBI may remunerate SBI for its services.</td>
</tr>
<tr>
<td>33</td>
<td>Other Business Which SBI May Transact</td>
<td>• SBI may engage in all ordinary banking business, such as:<br/>
→ Accepting deposits<br/>
→ Granting loans, advances, and overdrafts<br/>
→ Issuing letters of credit, drafts, cheques<br/>
→ Investing in securities<br/>
→ Managing provident funds, trusts, etc.</td>
</tr>
<tr>
<td>34</td>
<td>Prohibited Business</td>
<td>• SBI cannot engage in:<br/>
→ Trading or buying/selling goods for profit<br/>
→ Owning immovable property (except for business use)<br/>
→ Making unsecured loans to directors or related persons.<br/>
• These restrictions protect public funds and prevent conflicts of interest.</td>
</tr>
<tr>
<td>35</td>
<td>Power to Acquire Business of Other Banks</td>
<td>• SBI may acquire the business or assets of any other bank with RBI and Government approval.<br/>
• Rights and obligations of the acquired bank become those of SBI.</td>
</tr>
<tr>
<td>35A</td>
<td>Appointment of director by Sbi</td>
<td>If Sbi has an agreement with company to appoint directors, that appointment is valid, even if conflict with company law or other companies rules, such director:
<p>·       Serve at Sbi pleasure( Can be removed any time)</p>
<p>·       Are not personally liable for good faith, action</p>
<p>·       Are not subject to retirement or age/ Share limit</p></td>
</tr>
</tbody>
</table></div>
<p>CHAPTER VII – ACCOUNTS, AUDIT AND FUNDS (Sections 36–42)</p>
<p>Objective of Chapter VII</p>
<p>To ensure financial discipline, transparency, and accountability in the functioning of the State Bank of India.<br/>
It prescribes how SBI must maintain its accounts, manage reserves, distribute profits, and undergo statutory audits.</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Sec. No.</th><th>Section Title</th><th>Core Provision / Meaning</th></tr></thead>
<tbody>

<tr>
<td>36
<p>37</p></td>
<td>Funds and Reserves</td>
<td>• SBI shall create and maintain certain funds, such as:<br/>
→ Reserve Fund for contingencies.<br/>
→ Depreciation Fund for assets.<br/>
→ Bad Debt Reserve.<br/>
→ Integration and Development Fund (for rural and small sector development).</td>
</tr>
<tr>
<td>38</td>
<td>Disposal of Profits</td>
<td>• After paying expenses, losses, and taxes, SBI shall:<br/>
→ Transfer a portion of profits to Reserve Fund.<br/>
→ Pay dividend to shareholders (including Govt.).<br/>
→ Transfer balance to General Reserve or Development Funds.</td>
</tr>
<tr>
<td>39</td>
<td>Accounts and Balance Sheet</td>
<td>• SBI must prepare its annual accounts and balance sheet at the end of each accounting year (31st March).<br/>
• Must follow prescribed accounting standardsapproved by RBI and Government.</td>
</tr>
<tr>
<td>41</td>
<td>Audit</td>
<td>• Accounts of SBI shall be audited by auditorsappointed by the Central Government in consultation with the RBI.<br/>
• Auditor’s report submitted to Central Board and Government.</td>
</tr>
<tr>
<td>40</td>
<td>Returns</td>
<td>• SBI shall submit periodic returns and statements to RBI regarding its assets, liabilities, and operations.<br/>
• Enables RBI to assess SBI’s monetary position and compliance.</td>
</tr>
<tr>
<td>42</td>
<td>General Meeting and Discussion Balance Sheet</td>
<td>·       SBI hold general meeting of shareholders every year
<p>·       The audited balance sheet and profit reports are discussed in the meeting</p>
<p>·       Shareholder can ask questions and make suggestions</p></td>
</tr>
</tbody>
</table></div>
<p>CHAPTER VIII – MISCELLANEOUS PROVISIONS (Sections 43–57)</p>
<p>Objective of Chapter VIII</p>
<p>This chapter deals with administrative, legal, and transitional provisions of the Act.<br/>
It ensures discipline, secrecy, continuity, and regulatory control in the functioning of the State Bank of India after its establishment.</p>
<div class="table-responsive"><table class="blog-table"><thead><tr><th>Sec. No.</th><th>Section Title</th><th>Core Provision / Meaning</th></tr></thead>
<tbody>

<tr>
<td>43</td>
<td>Appointment of Officers and Employees</td>
<td>• SBI may appoint officers and staff as necessary for its functioning.<br/>
• Appointments made as per service regulationsframed by the Central Board with Government approval.</td>
</tr>
<tr>
<td>44</td>
<td>Obligation of Fidelity and Secrecy</td>
<td>• All SBI officers and employees must maintain confidentiality regarding customer accounts and bank affairs.<br/>
• Breach of secrecy is an offence under law.</td>
</tr>
<tr>
<td>45</td>
<td>Bar to Liquidation</td>
<td>• SBI cannot be voluntarily wound up or liquidatedunder company law.<br/>
• Only Parliament can decide to dissolve or restructure SBI.</td>
</tr>
<tr>
<td>46</td>
<td>Transfer of Employees from Subsidiary Banks</td>
<td>• Employees of former Imperial Bank or subsidiaries transferred to SBI shall continue under same service conditions, unless altered by consent.</td>
</tr>
<tr>
<td>47</td>
<td>Delegation of Powers</td>
<td>• Central Board may delegate powers to Chairman, MDs, or other officers for efficient management.</td>
</tr>
<tr>
<td>49</td>
<td>Power of Central Government to Make Rules</td>
<td>• The Central Government may make rules to carry out the purposes of the Act, in consultation with the RBI.</td>
</tr>
<tr>
<td>50</td>
<td>Power of Central Board to Make Regulations</td>
<td>• The Central Board may make regulationsconsistent with the Act and rules, covering:<br/>
→ Service conditions<br/>
→ Conduct of business<br/>
→ Meetings and procedures</td>
</tr>
<tr>
<td>51</td>
<td> Requirement of foreign law,</td>
<td>• if any foreign country law does not automatically transfer the imperial bank, asset to Sbi, then the imperial Bank must take necessary step under that country law to complete the transfer
<p>Purpose:-  to ensure that foreign asset and liabilities of imperial bank legally pass to Sbi.</p></td>
</tr>
<tr>
<td>57</td>
<td>Dissolution of Imperial Bank of India</td>
<td>• The Imperial Bank of India stands dissolved upon the establishment of SBI.<br/>
• All its assets, liabilities, and undertakings transferred to SBI.</td>
</tr>
<tr>
<td>55</td>
<td>No proceeding against imperial Bank after appointed day</td>
<td>After the appointment day, 1 July 1955
<p>No one can file case or claim against imperial Bank or its employee in India</p></td>
</tr>
<tr>
<td>56</td>
<td>Transitional and Savings Provisions</td>
<td>• Any contracts, rights, or obligations of the Imperial Bank continue with SBI.<br/>
• Legal continuity ensured.</td>
</tr>
</tbody>
</table></div>


    `
  },
  {
    id: "post-2",
    slug: "right-of-set-off-in-banking",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "RIGHT OF SET-OFF IN BANKING",
    author: "Prashant Jha",
    date: "October 25, 2025",
    readTime: "6 min read",
    comments: 0,
    views: 1120,
    published: true,
    excerpt: "In simple terms, Set-off means adjusting one debt against another when two parties owe money to each other...",
    content: `
      <h2>RIGHT OF SET-OFF IN BANKING LAW</h2>
      <h3>1. Meaning of Set-off</h3>
      <p>In simple terms, Set-off means adjusting one debt against another.</p>
      <p>👉 When two parties owe money to each other, the right of set-off allows one party to adjust their debt against the amount receivable from the other party.</p>
      <h3>2. Essential Conditions for Banker's Right of Set-Off</h3>
      <ul>
        <li><strong>Mutuality of Debts:</strong> The debts must be between the same parties in the same capacity.</li>
        <li><strong>Debt Due and Certain:</strong> The debt must be legally enforceable and determined in amount.</li>
        <li><strong>Notice to Customer:</strong> Prior notice must generally be served to the customer before exercising set-off unless agreed otherwise.</li>
        <li><strong>Same Capacity:</strong> A personal deposit cannot be set-off against a partner's joint account debt unless specified.</li>
      </ul>
      <h3>3. Exceptions & Limitations</h3>
      <p>The right of set-off cannot be exercised against trust accounts, specific purpose deposits, or unadjusted future debts.</p>
    `
  },
  {
    id: "post-3",
    slug: "garnishee-orders-in-banking",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "Garnishee Orders in Banking",
    author: "Prashant Jha",
    date: "October 23, 2025",
    readTime: "5 min read",
    comments: 0,
    views: 1540,
    published: true,
    excerpt: "A Garnishee Order is an order of a court directing a third person (the Garnishee) who owes money to the judgment debtor to pay...",
    content: `
      <h2>Garnishee Orders in Banking</h2>
      <h3>1. What is a Garnishee Order?</h3>
      <p>A Garnishee Order is an order of a court directing a third person (the Garnishee), who owes money to the Judgment Debtor, not to pay money to the debtor but to pay it to the Judgment Creditor instead.</p>
      <h3>2. Two Stages of Garnishee Order</h3>
      <ul>
        <li><strong>Garnishee Order Nisi:</strong> A temporary order served on the bank directing it to freeze the debtor's account and explain why the money should not be attached.</li>
        <li><strong>Garnishee Order Absolute:</strong> A final court order directing the bank to pay the specified amount directly to the court or judgment creditor.</li>
      </ul>
      <h3>3. Bank's Duty and Account Exceptions</h3>
      <p>Upon receipt of Garnishee Order Nisi, the bank must immediately attach the account up to the specified amount and notify the account holder.</p>
    `
  },
  {
    id: "post-4",
    slug: "mareva-injunction",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "MAREVA INJUNCTION",
    author: "Prashant Jha",
    date: "October 22, 2025",
    readTime: "7 min read",
    comments: 0,
    views: 940,
    published: true,
    excerpt: "A Mareva Injunction is a court order restraining a party from disposing of or removing assets out of the jurisdiction prior to judgment...",
    content: `
      <h2>MAREVA INJUNCTION</h2>
      <h3>1. What is a Mareva Injunction?</h3>
      <p>A Mareva Injunction (also known as a Freezing Order) is an interim court order that restrains a defendant from removing assets from the jurisdiction or disposing of them in order to avoid paying a judgment debt.</p>
      <h3>2. Why it was needed</h3>
      <p>To prevent dishonest defendants from draining their bank accounts or transferring assets abroad before trial concludes.</p>
      <h3>3. Origin & Legal Principles</h3>
      <p>Originating in the English court case <em>Mareva Compania Naviera SA v International Bulkcarriers SA (1975)</em>, it has been recognized by courts worldwide including Indian courts under Order 38 Rule 5 of CPC.</p>
    `
  },
  {
    id: "post-5",
    slug: "introduction-to-banking-law",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "INTRODUCTION TO BANKING LAW",
    author: "Prashant Jha",
    date: "September 21, 2025",
    readTime: "9 min read",
    comments: 0,
    views: 2450,
    published: true,
    excerpt: "Nature, Scope, and Functions of Banking Law — Banking law is a set of legal rules and regulations that control how banks operate...",
    content: `
      <h2>INTRODUCTION TO BANKING LAW</h2>
      <h3>1. Nature, Scope, and Functions of Banking Law</h3>
      <p>Banking law is a set of legal rules and regulations that control how banks and financial institutions operate, accept deposits, grant credit, and facilitate national monetary stability.</p>
      <h3>2. Essential Statutory Framework in India</h3>
      <ul>
        <li>Banking Regulation Act, 1949</li>
        <li>Reserve Bank of India Act, 1934</li>
        <li>State Bank of India Act, 1955</li>
        <li>Negotiable Instruments Act, 1881</li>
      </ul>
      <h3>3. Relationship Between Banker and Customer</h3>
      <p>Primary relationship is Debtor and Creditor, alongside secondary agency and trustee relationships.</p>
    `
  },
  {
    id: "post-6",
    slug: "why-teachmelegal-journey-making-law-simple",
    category: "Teachmelegal",
    categoryColor: "#c5a059",
    title: "Why Teachmelegal? – The Journey of Making Law Simple",
    author: "Prashant Jha",
    date: "September 21, 2025",
    readTime: "5 min read",
    comments: 0,
    views: 1980,
    published: true,
    excerpt: "When I started my legal career, one thing became very clear to me—law is often taught in a way that feels complicated and disconnected...",
    content: `
      <h2>Why Teachmelegal? – The Journey of Making Law Simple</h2>
      <p>When I started my legal career, one thing became very clear to me—law is often taught in a way that feels complicated and disconnected from real life. Students memorize sections, but miss out on practical legal application.</p>
      <h3>Our Vision</h3>
      <p>To bridge the gap between classroom theory and real Supreme Court advocacy. We break down complex statutes into structured tables, flowcharts, and clear explanations that make learning law engaging and memorable.</p>
      <h3>What Makes Teach Me Legal Unique?</h3>
      <ul>
        <li>Direct insights from practicing Supreme Court advocates</li>
        <li>Comprehensive subject-wise notes and revision charts</li>
        <li>Dedicated video lectures and question bank materials</li>
      </ul>
    `
  }
];

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'blogs.json');

function initStore() {
  if (global.__blogsStore && global.__blogsStore.length > 0) {
    return global.__blogsStore;
  }
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__blogsStore = parsed;
        return global.__blogsStore;
      }
    }
  } catch (e) {
    console.error('Error reading blogs.json, falling back to initial posts:', e);
  }
  global.__blogsStore = [...INITIAL_POSTS];
  saveToDisk();
  return global.__blogsStore;
}

function saveToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(global.__blogsStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing blogs.json:', e);
  }
}

// Global in-memory storage during dev runtime
initStore();

global.__analyticsStore = [
  { id: 'ev-1', path: '/', date: '2026-09-16', views: 420 },
  { id: 'ev-2', path: '/blog', date: '2026-09-16', views: 230 },
  { id: 'ev-3', path: '/blog/state-bank-of-india-act-1955', date: '2026-09-16', views: 145 },
  { id: 'ev-4', path: '/courses', date: '2026-09-16', views: 180 },
  { id: 'ev-5', path: '/books', date: '2026-09-16', views: 95 }
];

export function getAllPosts(includeDrafts = false) {
  const posts = initStore();
  if (includeDrafts) return posts;
  return posts.filter(p => p.published);
}

export function getPostBySlug(slug) {
  const posts = initStore();
  const post = posts.find(p => p.slug === slug);
  if (post) {
    post.views = (post.views || 0) + 1;
  }
  return post;
}

export function getPostById(id) {
  const posts = initStore();
  return posts.find(p => p.id === id);
}

export function createPost(data) {
  initStore();
  const newPost = {
    id: `post-${Date.now()}`,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: data.category || 'Banking Law',
    categoryColor: data.categoryColor || '#3b82f6',
    title: data.title,
    author: data.author || 'Advocate Prashant Jha',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: data.readTime || '8 min read',
    comments: 0,
    views: 0,
    published: data.published !== false,
    excerpt: data.excerpt || data.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...',
    content: data.content
  };
  global.__blogsStore.unshift(newPost);
  saveToDisk();
  return newPost;
}

export function updatePost(id, data) {
  initStore();
  const index = global.__blogsStore.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  global.__blogsStore[index] = {
    ...global.__blogsStore[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveToDisk();
  return global.__blogsStore[index];
}

export function deletePost(id) {
  initStore();
  const index = global.__blogsStore.findIndex(p => p.id === id);
  if (index === -1) return false;
  global.__blogsStore.splice(index, 1);
  saveToDisk();
  return true;
}

export function getAnalyticsStats() {
  const posts = initStore();
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0) + 1250;
  const totalBlogs = posts.length;
  const publishedBlogs = posts.filter(p => p.published).length;
  const draftBlogs = posts.filter(p => !p.published).length;

  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const categories = {};
  posts.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });

  return {
    totalViews,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    topPosts,
    categories,
    recentTraffic: [
      { day: 'Mon', views: 320 },
      { day: 'Tue', views: 450 },
      { day: 'Wed', views: 510 },
      { day: 'Thu', views: 490 },
      { day: 'Fri', views: 680 },
      { day: 'Sat', views: 720 },
      { day: 'Sun', views: 890 }
    ]
  };
}
