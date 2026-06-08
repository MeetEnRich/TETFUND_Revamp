THE REVAMP OF TERTIARY EDUCATION TRUST FUND (TETFUND) WEBSITE





BY



UMAR, Ya'u Sadiq

(2022/CP/CSC/0069)





A PROJECT REPORT SUBMITTED TO THE DEPARTMENT OF COMPUTER SCIENCE, FACULTY OF COMPUTING, IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE AWARD OF BACHELOR OF SCIENCE (BSc) DEGREE IN COMPUTER SCIENCE OF FEDERAL UNIVERSITY OF LAFIA.







MARCH, 2026



CHAPTER ONE

INTRODUCTION

1.1 Background of the Study

	Governments around the world have, over the past two decades, turned increasingly to digital technology as a tool for improving how public services are delivered. This is not a new observation. What is worth noting, however, is how rapidly the expectation has shifted: where a functional government website was once considered a bonus, it is now regarded as a basic requirement of institutional legitimacy. The broader concept driving this shift is electronic governance, or e-governance, which refers to the deliberate use of Information and Communication Technologies by state institutions to improve transparency, reduce administrative friction, and extend service reach beyond the physical boundaries of government offices (Amara, 2019).

	For Nigeria, e-governance is not merely a technology ambition. It is a policy imperative. The National Digital Economy and E-Governance Act of 2024 explicitly mandates that all Federal Ministries, Departments, and Agencies maintain functional, accessible, and transactional web portals. The Bureau of Public Service Reforms has gone further, issuing directives that require MDAs to reduce and, where possible, eliminate physical-contact transactions. Against this backdrop, the digital infrastructure of any major federal agency is a matter of public interest, not just institutional preference.

	TETFund occupies a uniquely important position in Nigeria's tertiary education ecosystem. Established under the TETFund Act of 2011, the agency is mandated to collect and disburse the Education Tax levied on Nigerian companies, channelling those funds into the rehabilitation and development of public universities, polytechnics, and colleges of education. In the 2024 fiscal year, TETFund disbursed over N683 billion in intervention funds, covering physical infrastructure construction, faculty training, research grants, and library development across several hundred beneficiary institutions (TETFund, 2024). The scale of this activity is significant. Hundreds of contractors, dozens of beneficiary institutions, and numerous government officials interact with TETFund's procurement machinery in every annual cycle.

	And yet the agency's digital interface does not reflect this scale at all. The current TETFund website functions, in practice, as a static information board. It carries some news, a few downloadable documents, and contact details. It does not support online procurement transactions of any kind. Contractors who want to bid for TETFund projects must physically travel to the agency's headquarters in Abuja to deposit sealed tender envelopes in designated boxes. To find out about an available tender in the first place, they must monitor national newspapers or make telephone enquiries to the Procurement Department. This arrangement is expensive. It is exclusionary. And it is completely at odds with what the Federal Government has publicly committed to achieving in digital public service delivery (BPSR, 2025).

	A growing body of research confirms that this is not an isolated institutional failure. Oshadami (2025) found that the majority of Nigerian government agency websites scored poorly on digital readiness metrics, with the most common failures being outdated content, broken links, and the complete absence of transaction-enabling features. Ojugo (2018) made a similar finding at the institutional level: Nigerian academic and government websites routinely fail their users not because content is missing, but because the architecture of the website makes the content impossible to find or act upon. The TETFund website fits this description precisely.

	This project proposes a comprehensive revamp of the TETFund website. The revamp goes beyond a cosmetic redesign. It involves rebuilding the site's information architecture, introducing a real-time procurement dashboard where active Invitations to Tender can be browsed and tracked, and implementing a secure electronic bid submission portal that allows contractors to upload tender documents online, select the correct procurement category through a mandatory form control, and receive an automated digital acknowledgment of their submission. Taken together, these features represent a fundamental modernisation of how TETFund engages with the contractors and institutions it serves.

1.2 Statement of the Problem

	The problems driving this project are specific and well-documented. They are not generalised complaints about digital lag in government. They are concrete operational failures that have real consequences for real contractors.

	The first problem is the absence of real-time bid information. TETFund currently has no live, searchable repository of active tenders. A contractor in Calabar or Sokoto who wants to know what procurement opportunities are currently open must either buy a national newspaper, call the Procurement Department and hope someone answers, or visit a website that may or may not have been updated recently. This information asymmetry advantages Abuja-based firms that are geographically close to the agency and can learn about opportunities through informal channels before the official publication catches up. Open competition, which is a foundational principle of public procurement regulation, cannot exist in this environment (BPSR, 2025).

	The second problem is the physical submission requirement. Under the current system, a contractor who wants to submit a bid must print the entire tender document, bind it, seal it, and then physically transport it to the TETFund head office in Abuja before the closing time. For a firm based in Port Harcourt or Maiduguri, this journey can cost more, in travel and accommodation expenses, than the administrative profit on a small-value contract. The requirement effectively prices smaller firms out of participation in TETFund procurement, concentrating contract awards in a narrow geographic and financial bracket of firms (Oniyangi and Ibrahim, 2024).

	The third problem is arguably the most troubling, because it is entirely avoidable. At TETFund's office, submitted envelopes are sorted into category-specific physical boxes designated for Works, Goods, and Services. A contractor who deposits their envelope in the wrong box is automatically disqualified during evaluation, regardless of the quality or competitiveness of their bid. This study refers to this as the Wrong Box Problem. It is a systemic error that is built into the architecture of the manual submission process. It has no rational justification in a properly designed digital system, and its consequences for affected contractors are severe and non-recoverable (Oniyangi and Ibrahim, 2024).

1.3 Aim and Objectives

	The aim of this project is to revamp the TETFund website by designing and developing a modern, secure, and interactive web-based platform that improves procurement transparency, enables electronic bid submission, and consolidates stakeholder-facing services into a unified digital interface.

The specific objectives are:

To redesign the TETFund website with a responsive User Interface that performs correctly on both mobile and desktop devices, in compliance with NITDA's Software Development Guidelines.

To develop a real-time public dashboard aggregating active bid advertisements, news updates, event notices, and downloadable procurement documents in a single searchable interface.

To implement a secure e-bid submission portal through which registered contractors can upload tender documents in PDF or ZIP format, select the correct procurement category via a mandatory drop-down field, and receive an automated digital acknowledgment upon successful submission.

To design a role-based authentication system supporting three actor classes: Contractor, Beneficiary, and Administrator, with a Single Sign-On gateway linking the main portal to BIMS and TERAS.

To evaluate the proposed system against the limitations of the existing manual process, with particular focus on error prevention, processing speed, and geographic accessibility.

1.4 Significance of the Study

The significance of this work can be considered at three levels.

	For contractors, the most immediate benefit is the elimination of the Abuja Journey. Submitting a bid electronically from any location in Nigeria costs nothing beyond an internet connection. There is no travel. No accommodation. No risk of the envelope arriving late or being lost. More importantly, the mandatory category drop-down in the e-bid portal makes the Wrong Box Problem structurally impossible. A contractor cannot submit to the wrong category because the system does not allow submission until a valid category has been selected. The automated acknowledgment also gives contractors a timestamped, uniquely referenced receipt of their submission, which is a legal protection that the current physical system simply does not provide.

	For TETFund staff, the benefits are equally concrete. A real-time digital submission inbox eliminates the labour of manually sorting, cataloguing, and routing hundreds of physical envelopes during the busy post-deadline period. Evaluation committees can access submitted bids instantly and securely through the admin dashboard, without waiting for documents to be carried between offices. The system also reduces the volume of routine telephone enquiries from contractors asking about open tenders, because that information will be continuously available and up to date on the public dashboard.

	For the wider public, and for the Nigerian government's digital transformation agenda, the project demonstrates a replicable model. TETFund is not the only federal agency still running procurement on paper. A well-documented, openly available implementation of an e-bid portal for a government agency of this scale provides a practical reference for similar modernisation efforts elsewhere in the public sector.

1.5 Scope of the Study

	This project covers the design and development of a revamped TETFund website with five core components: a redesigned responsive public interface; a real-time news and bid advertisement dashboard; a secure e-bid document upload portal; a role-based authentication system; and a Converged Services gateway linking the portal to BIMS and TERAS via Single Sign-On. The backend is built on Node.js with the Express.js framework. MySQL serves as the production database, with SQLite used in the local development environment. The frontend uses standard HTML5, CSS3, and JavaScript.

	The project does not cover TETFund's internal financial transaction systems, the backend architecture of BIMS or TERAS, or any integration with IPPIS. The system handles bid submission and acknowledgment, but the evaluation and award phases of the procurement process remain outside scope.

1.6 Limitation of the Study

	The most significant practical limitation of this project is the inability to conduct integration testing within TETFund's live server environment. Access to the agency's production infrastructure would require formal institutional authorisation that falls outside the scope of an undergraduate research project. All testing is therefore conducted on a locally hosted simulated environment, and the performance figures reported reflect test conditions rather than production-scale traffic. The challenge of intermittent internet connectivity in parts of Nigeria is acknowledged as a potential real-world limitation of the deployed system, though it is not addressed within the scope of this work.

1.7 Definition of Operational Terms

Invitation to Tender (ITT): An official public notice issued by a procuring entity, inviting eligible companies or individuals to submit bids for a specified project or service contract.

E-Bid System: A digital platform that enables contractors to submit tender documents electronically, replacing the traditional physical submission process.

Wrong Box Problem: The systemic disqualification of contractors in TETFund's physical tendering process caused by the accidental deposit of a bid envelope in a category box other than the intended one.

Responsive Design: A web design approach in which the layout of a website adjusts fluidly to fit different screen sizes, from desktop monitors down to mobile phones.

BIMS: The Biometric Identity Management System used by TETFund to verify the identities of staff and students from beneficiary institutions.

TERAS: The TETFund Electronic Research Administration System, through which beneficiary institutions apply for research and training intervention grants.

Single Sign-On (SSO): An authentication mechanism that allows a user to log in once and access multiple linked systems without re-entering credentials.

Role-Based Access Control (RBAC): A security model in which system permissions are assigned to users based on their designated role, rather than granted individually.

Node.js: An open-source, server-side JavaScript runtime environment designed for building scalable, event-driven web applications.

MySQL: An open-source relational database management system that organises and retrieves data using Structured Query Language (SQL).

1.8 Organization of the Work

	This report is organized into five chapters. Chapter One establishes the context of the study, covering the background, problem statement, aim and objectives, significance, scope, and limitations. Chapter Two presents the literature review, structured around a conceptual review, a theoretical framework, and a critical analysis of fifteen related works. Chapter Three describes the research methodology in full, including the analysis of the existing system, the design of the proposed system, the development approach, and the complete system specifications covering database design, module definitions, and the system flowchart. Chapter Four presents the implementation, system testing, and results. Chapter Five provides the summary of findings, conclusions, and recommendations for future work.



CHAPTER TWO

LITERATURE REVIEW

2.1 Conceptual Review

	To properly situate this project within the existing body of knowledge, it is important to first establish the conceptual foundations on which it rests. Three concepts are central: digital governance, electronic procurement, and web usability.

2.1.1 Digital Governance and E-Governance

	Digital governance is the organised use of ICT to restructure how government institutions collect, process, store, and share information in serving citizens and other stakeholders. It is a deceptively broad concept. At its narrowest, it can mean simply putting a PDF version of a form on a website. At its fullest expression, it means redesigning the entire logic of a public service around what digital infrastructure makes possible: real-time data, automated workflows, verifiable audit trails, and remote access for anyone with an internet connection (Amara, 2019).

	Nigeria's policy framework has, at least on paper, committed to the fuller definition. The National Digital Economy and E-Governance Act of 2024 requires federal agencies to provide transactional digital services, not just information pages. NITDA's Software Development Guidelines set minimum technical standards for government web platforms. The Bureau of Public Service Reforms publishes an annual MDA website scorecard that publicly rates agencies on their digital performance (BPSR, 2025). The intent is clear. The gap between intent and reality, as Oshadami (2025) has shown, remains very wide. For TETFund, closing that gap is precisely what this project attempts.

2.1.2 Electronic Procurement (E-Procurement)

	Electronic procurement is the application of digital tools to the full lifecycle of a public purchasing or contracting process. This lifecycle has several distinct stages: advertising the opportunity, registering interested bidders, receiving and storing submitted documents, evaluating bids, and communicating the award decision. A well-designed e-procurement system automates or digitally supports each of these stages, replacing paper flows with database transactions and physical travel with secure internet-based interactions (Bello et al., 2019).

	The case for public e-procurement is not theoretical. Musa et al. (2023) documented the attitudinal dimension: Nigerian public sector employees are prepared to accept digital procurement tools, provided those tools are genuinely useful and trustworthy. Oniyangi and Ibrahim (2024) documented the cost dimension: the manual physical process creates specific, recurring, and entirely preventable errors that have real financial consequences for contractors. Together, these two findings frame the e-procurement problem from both the demand side and the supply side. This project responds to both.

2.1.3 Web Usability and User-Centred Design

	Web usability is a measure of how well a website allows its intended users to accomplish their goals. The foundational framework for measuring and improving usability remains Nielsen's ten heuristics of interface design, first published in 1994 and still widely applied. The most relevant heuristics for this project are: visibility of system status, meaning users should always know what the system is doing; error prevention, meaning the system should be designed to make errors difficult or impossible to commit; and recognition rather than recall, meaning the system should not force users to remember information from one page to the next (Ojugo, 2018).

	User-Centred Design takes these usability principles and embeds them in the development process itself, insisting that real users' needs, goals, and limitations must be considered from the very first design decision. This is not just a methodological nicety. Adegboye and Salami (2021) found that Nigerian institutional web portals consistently and predictably fail on error prevention and help documentation. The Wrong Box Problem is a perfect example of this failure in the TETFund context: the system offers no guidance, no warning, and no recovery mechanism. The mandatory drop-down category selector in the proposed e-bid portal is a direct, UCD-motivated response to this documented pattern of failure.

2.2 Theoretical Review

	Two theoretical frameworks inform the design and evaluation decisions made in this project. Both are well-established in Information Systems research and have been applied specifically within Nigerian public sector contexts.

2.2.1 Technology Acceptance Model (TAM)

	The Technology Acceptance Model was proposed by Davis in 1989 and has since become one of the most widely cited frameworks in Information Systems research. Its central claim is straightforward: the adoption of an information system is primarily determined by two user perceptions. The first is Perceived Usefulness (PU), which is the degree to which a user believes the system will improve their performance. The second is Perceived Ease of Use (PEOU), which is the degree to which a user believes the system will be free of unnecessary effort. These two perceptions influence the user's attitude toward the system, which in turn shapes their intention to actually use it (Musa et al., 2023).

	Applied to this project, TAM generates a clear design requirement: the TETFund e-bid portal will not achieve adoption unless contractors perceive it as genuinely more useful than the physical submission process and easy enough to use without specialist training. This is a higher bar than it might seem. Many government digital systems are adopted in name only because civil servants are required to use them, not because they choose to. Contractors, who are voluntary participants in the tendering process, can simply opt out. They will use the portal only if they trust it and find it worth their time.

	Musa et al. (2023) applied TAM specifically to Nigerian public sector e-procurement and confirmed that trust was at least as important as perceived usefulness in determining adoption intent. The proposed system addresses trust through two specific design features: the timestamped Submission Acknowledgment, which gives the contractor verifiable proof that their bid was received, and the real-time bid status tracker, which keeps the contractor informed throughout the evaluation period rather than leaving them in the information vacuum that characterises the current physical process.

2.2.2 Inter-Organizational Information Systems (IOIS) Theory

	Inter-Organizational Information Systems Theory concerns systems that must serve multiple organisations simultaneously and support coordinated workflows across institutional boundaries. A TETFund web portal is exactly this kind of system. It must interface with private contracting firms, public universities and polytechnics, the Bureau of Public Procurement, and at least three internal TETFund departments: Procurement, Finance, and ICT. Each of these actors has different data needs, different levels of system access, and different views of the same underlying transactions.

	IOIS theory identifies three design imperatives that are particularly relevant here. First, standardised data formats: all parties interacting with the system must be able to produce and consume data in a consistent structure, which is why the database schema uses enumerated types for categories and roles rather than free-text fields. Second, clear role segregation: each actor class must see only the information and functions appropriate to their role, which is implemented through role-based access control middleware on every API endpoint. Third, shared audit mechanisms: all significant system events must be recorded in a tamper-evident log that any authorized party can inspect, which is the purpose of the AUDIT_LOG table in the database design (Osunade et al., 2024). These three imperatives are not abstract ideals. Each one maps directly to a specific technical decision made in the proposed system.

2.3 Review of Related Works

	The following fifteen works were selected for review on the basis of their direct relevance to the research problem. The review covers the period from 2018 to 2025, capturing a body of literature that spans the pre-COVID baseline, the accelerated digital shift of 2020 to 2022, and the more mature post-pandemic period of digital consolidation.

2.3.1 Web-Based E-Tendering System for Public Entities (Bello et al., 2019)

	This is the closest technical antecedent to the present study. Bello and his colleagues developed a web-based e-tendering system for Nigerian public procuring entities, arguing that the manual systems in use at most agencies were structurally prone to error and opacity. Their system covered the full tendering lifecycle: notification, submission, opening, evaluation, and awarding. Using object-oriented design methodologies, they demonstrated that a functional digital procurement system for a Nigerian public institution was technically achievable within normal project constraints. The work is highly relevant and extensively cited in this study. Its key limitation, however, is that it treated the procuring institution as an isolated entity. No attempt was made to integrate with student-facing or identity management systems, and no Converged Services architecture was proposed.

2.3.2 E-Procurement Adoption and User Intention (Musa et al., 2023)

	Musa et al. used the Technology Acceptance Model to survey Nigerian public sector employees about their attitudes toward digital procurement. The findings were nuanced. Perceived usefulness and trust emerged as the dominant adoption predictors, which makes sense: a government procurement process involves significant financial stakes, and no rational contractor will trust a new digital system without evidence that it works. The study's limitation is that it produced attitudinal findings without implementing or testing a working system. It tells us what a good system needs to achieve; it does not show us how to build one.

2.3.3 Redesigning Academic Websites for Visibility (Ojugo, 2018)

	Ojugo's analysis of the FUPRE website produced a finding that is, on reflection, quite counterintuitive: the problem with Nigerian government websites is not that information is absent, it is that the navigation is so poor that users cannot find what is there. He recommended that usability maintenance should constitute at least sixty percent of a website's total lifecycle budget. This is an aggressive recommendation, and it may not be universally applicable, but the underlying principle matters for this project. The TETFund revamp implements a faceted search interface for bid alerts and a persistent navigation structure that makes any content on the site reachable within three clicks.

2.3.4 Consolidation of University Web Portals (Osunade et al., 2024)

	Using heuristic evaluation and think-aloud protocol methods, Osunade and colleagues documented significant user frustration with fragmented institutional portals at the University of Ibadan. Students had to navigate to different URLs, remember different passwords, and relearn different interfaces for admission, registration, and payment. The recommended solution, a single consolidated entry point with mobile optimisation, is directly implemented in this project through the Converged Services gateway that brings BIMS and TERAS under the TETFund main portal via Single Sign-On.

2.3.5 Mobile-First Automated Clearance Systems (Taiwo and Faboya, 2025)

	This study matters primarily because of one statistic: a mobile-first clearance system reduced physical office visits by forty percent. In a country where the majority of internet users access the web through mobile devices, designing for desktop first and then adapting downward is a choice that leaves a significant portion of users underserved by default. The proposed TETFund portal takes the opposite approach, building for small screens first. Taiwo and Faboya also noted high mobile data consumption as a limitation, which the present project addresses by minimising JavaScript bundle sizes and optimising image delivery.

2.3.6 Electronic Administration for Registry Units (Ibiyomi et al., 2024)

	The concept of signature-chasing, as Ibiyomi and colleagues called it, refers to the process of physically carrying documents between offices to collect sequential authorisations. Digitising this workflow, their study showed, eliminated the phenomenon almost entirely. The parallel in TETFund's context is the contractor's journey: physically carrying documents from their home state to Abuja, then to the correct box in the correct room in the correct building. The centralised archiving model developed by Ibiyomi et al. directly informs the database architecture of the submission management system proposed here.

2.3.7 Robust Web-Based Clearance and Sessional Tracking (Ekoro and Bassey, 2024)

	Peak load is a real and specific problem for any system that processes time-sensitive submissions from a large user base. Ekoro and Bassey documented the challenge in the context of academic clearance systems, where the approach of a deadline produces a sharp spike in concurrent system usage. For TETFund, this problem is structurally identical: the hours before a major ITT closing date will generate intense server traffic. Their recommendation of incremental processing and server-side request queuing informs the backend design of the e-bid portal's upload handling module.

2.3.8 Real-Time Tracking and Progress Visualization (Eweoya et al., 2024)

	Eweoya and colleagues found, through controlled experimentation, that visible progress feedback during online procurement processes reduced measurable user anxiety. The specific mechanism was a status indicator that displayed the current processing stage of a submitted document. This is a small feature with a disproportionately large impact on user experience. The bid status tracker in the proposed system, which displays three states (Received, Under Evaluation, and Approved), is a direct application of this finding.

2.3.9 Scalability of Python-Based Government Servers (Awofolaju et al., 2023)

	Although Awofolaju and colleagues used Python rather than the Node.js stack adopted in this project, their core findings on event-driven, non-blocking server architecture for high-concurrency government portals are technology-agnostic in their implications. Node.js was chosen in part because it shares the same fundamental architectural characteristic: a single-threaded event loop that handles concurrent connections without the overhead of creating a new thread per request. Awofolaju et al.'s load-testing methodology also provides a useful benchmark framework for evaluating the performance of the proposed system under simulated peak conditions.

2.3.10 Usability and User Satisfaction at IBB University (Adamu, 2022)

	The headline finding of Adamu's survey, a ninety-five point three percent approval rating for web-based administrative systems at IBB University, is worth pausing on. It directly contradicts the assumption, sometimes made in discussions of Nigerian technology adoption, that users in this context are resistant to digital systems by disposition. They are not. What Adamu's data shows is that when a system is built with genuine attention to the user's needs, people will use it and will be satisfied with it. This is an important baseline for the TETFund revamp: the goal is not to force adoption but to build something that contractors will actively want to use.

2.3.11 Biometric Security in Institutional Portals (Jibril and Umar, 2021)

	Jibril and Umar demonstrated that biometric identifiers effectively prevent impersonation in institutional access control systems. The TETFund revamp does not implement biometric hardware, for the straightforward reason that deploying and maintaining biometric readers across a nationally dispersed contractor base is prohibitively expensive. However, the authentication principles established in this study inform the design of the role-based access control architecture, particularly the requirement that each contractor account be uniquely and verifiably linked to a registered legal entity rather than a personal identity.

2.3.12 Digital Governance Readiness in Nigerian Government Agencies (Oshadami, 2025)

	Oshadami's national survey found that most Nigerian government agency websites fail on the same small set of dimensions: outdated content, non-functional links, and the complete absence of transactional features. TETFund's current website is consistent with this national pattern. Oshadami's findings are important for this project not as a source of design guidance, since they describe problems rather than solutions, but as empirical evidence that the problem this project addresses is neither unique nor fabricated. The TETFund revamp is one instance of a much wider need.

2.3.13 Procurement Errors in Manual Tendering (Oniyangi and Ibrahim, 2024)

	This study provides the most direct empirical foundation for one of the central innovations of this project. Oniyangi and Ibrahim conducted a systematic case analysis of procurement disqualification records and identified the physical box mis-sorting error as a recurring, documented, and entirely preventable source of wrongful disqualification. Their data shows that contractors, through no fault in the quality of their bids, are regularly removed from competitive processes because of a purely logistical failure in the submission infrastructure. The mandatory category drop-down in the proposed e-bid portal eliminates this error class by design. It is architecturally impossible to submit a bid to the wrong category in the proposed system, because the system does not permit submission until a valid category has been explicitly selected.

2.3.14 Assessment of E-Governance in Nigerian Tertiary Education (Amara, 2019)

	Amara's cross-institutional assessment made a recommendation that seems obvious in retrospect but is frequently ignored in practice: technology should be introduced through a phased, stakeholder-informed adoption strategy rather than a top-down imposition. Systems that are imposed without user input tend to be poorly designed for the actual conditions of use, and poorly designed systems generate resistance that is then mistakenly attributed to user conservatism rather than design failure. The Agile development methodology adopted in this project is a methodological operationalisation of Amara's recommendation: iterative delivery, sprint reviews, and stakeholder feedback at every stage.

2.3.15 Usability of Student Web Portals in Nigerian Tertiary Institutions (Adegboye and Salami, 2021)

	Using heuristic evaluation and think-aloud protocol methods, Adegboye and Salami found that Nigerian institutional web portals consistently violated Nielsen's heuristics on error prevention and help documentation. These are the exact failure modes that define the TETFund contractor experience. A contractor who deposits their envelope in the wrong box receives no error message, no warning, and no path to recovery. The system simply processes the disqualification at evaluation, weeks later, without explanation. The proposed system is evaluated in part using the same heuristic framework that Adegboye and Salami applied, making their findings both a motivation and a measuring stick for this work.

2.4 Summary of Reviewed Literature

The table below presents a consolidated summary of the fifteen works reviewed in this chapter.





2.4.1 Research Gaps Identified

Reading across the fifteen works reviewed above, three gaps emerge clearly.

	First, no existing study has produced a working prototype specifically designed for a national education funding agency. Bello et al. (2019) came closest, but their work was generic to Nigerian public procuring entities and did not account for the specific operational context of TETFund, which handles a contractor base that is geographically dispersed across all thirty-six states and the FCT, submitting bids for projects that range from laboratory construction to faculty training programmes. Context matters in system design. A procurement portal for TETFund is not simply a smaller version of a federal ministry procurement portal.

	Second, no existing study has proposed or implemented a Converged Services model that brings a public procurement portal and a student-facing identity management system under a single authentication framework. BIMS and TERAS currently exist as separate digital environments with no connection to the TETFund public website. Beneficiary institutions must navigate three separate systems with three separate sets of credentials to interact with TETFund across its different service areas. This fragmentation is a direct violation of the IOIS design imperative identified by Osunade et al. (2024), and it has not been addressed in any existing implementation.

	Third, and most specifically, the Wrong Box Problem has been documented as a recurring source of injustice in TETFund's procurement process (Oniyangi and Ibrahim, 2024), but no existing study has proposed a technical solution for it. This project provides the first documented system specification in which the elimination of this error class is a primary design objective, implemented through a mandatory categorical selection mechanism that is validated on both the client and server sides of the application.



CHAPTER THREE

RESEARCH METHODOLOGY

3.1 Analysis of the Existing System

	Understanding what is wrong with the current system is not a formality. It is the necessary first step in designing a replacement that actually solves the right problems. The existing TETFund procurement process follows four sequential stages, and each stage has its own distinct failure mode.

	The first stage is Information Discovery. A contractor who wants to bid for a TETFund project must somehow find out that the opportunity exists. Currently, this means monitoring national newspapers, calling the Procurement Department directly, or checking a website that may or may not carry current information. There is no centralised, live, searchable database of open tenders. The practical consequence is that information about available contracts spreads unevenly. Firms in Abuja, physically close to the TETFund office and plugged into the informal networks of the procurement community, often learn about opportunities before the official publication reaches firms in distant states. This is not a minor inconvenience. It is a structural violation of the open competition principle that public procurement law is designed to enforce (BPSR, 2025).

	The second stage is Document Preparation. Once a contractor knows about a tender, they must obtain the specific requirements, which may itself require a visit to the TETFund office or payment for a hard-copy bid document. They then prepare, print, and bind the entire tender response. For complex projects, this can run to several hundred pages. The administrative cost of this stage, multiplied across multiple active tenders in a given cycle, is substantial and falls entirely on the contractor.

	The third stage is Physical Submission. The contractor, or a designated representative, must travel to TETFund headquarters in Abuja and deposit the sealed envelope before the closing deadline. For a firm in Kebbi, Bayelsa, or Anambra, this journey can require an overnight stay and transport costs that, for smaller contracts, genuinely approach the expected financial return. Documents are at risk of loss or damage in transit. Arriving even one minute after the closing time means disqualification, regardless of the reason for the delay.

	The fourth stage is the Physical Box System. Inside the TETFund office, submitted envelopes are sorted into three designated boxes: Works, Goods, and Services. This is where the Wrong Box Problem occurs. A contractor who misidentifies the correct box, whether through misreading the tender description or simple confusion in a busy submission environment, is automatically disqualified during the opening and evaluation phase. There is no mechanism for detecting or correcting this error at the point of submission. There is no appeal. The disqualification is absolute (Oniyangi and Ibrahim, 2024).

3.1.1 Advantages of the Existing System

A thorough analysis requires acknowledging that the current system does have some genuine advantages, however limited.

The physical submission process does not depend on internet connectivity. In a country where power outages and network disruptions are common operational realities, this is not a trivial advantage.

Face-to-face interaction at the TETFund office allows contractors to seek immediate clarification from desk officers on ambiguous tender requirements, reducing the risk of non-compliant submissions caused by misunderstanding.

The sealed physical envelope provides a concrete and universally understood guarantee of submission confidentiality. Even contractors with no familiarity with digital systems understand that a sealed envelope cannot be opened before the official date.

The existing process operates within an established legal and procedural framework under the Public Procurement Act, which gives contractors a clear, if imperfect, basis for challenging irregularities.

3.1.2 Disadvantages of the Existing System

The disadvantages are more numerous and carry significantly heavier consequences.

The physical submission requirement imposes financial and logistical burdens on contractors that are disproportionate to the value of many contracts, effectively excluding smaller and geographically distant firms from participation.

The absence of a live online tender repository creates information asymmetry that concentrates awareness of opportunities among Abuja-based firms, undermining open competition.

The manual category-box sorting system introduces an avoidable and entirely non-technical error, the Wrong Box Problem, that wrongfully disqualifies compliant bidders.

Physical procurement records are vulnerable to fire, flood, theft, and unauthorised alteration. A digital system with proper backup procedures eliminates all of these risks.

Once a physical submission has been made, the contractor receives no further information about its status until an award decision is communicated, which can take months. This information vacuum creates legitimate uncertainty and undermines trust in the process.

The entire arrangement is inconsistent with the Federal Government's stated e-governance agenda and the BPSR's directive to minimise physical-contact transactions.

3.2 Analysis of the Proposed System

	The proposed system is built around three non-negotiable principles: openness, in the sense that all procurement information is publicly visible and searchable at all times; security, meaning all user accounts, submitted documents, and stored records are protected by industry-standard technical measures; and accountability, meaning that every transaction on the platform generates a permanent, timestamped audit trail that cannot be altered.

	These principles translate into a system that handles the four stages of the procurement process very differently from the current approach. Where the existing process relies on newspapers for information discovery, the proposed system provides a live dashboard. Where it requires physical document transport, the proposed system provides a guided, validated upload interface. Where it relies on a box in an office, it uses a relational database. And where the existing process leaves contractors in the dark after submission, the proposed system provides a real-time status tracker.

	The mandatory category drop-down is worth highlighting specifically, because it is the most targeted solution in the entire design. It is not a generalised improvement. It is a single control, added to a single form, that makes one specific and documented injustice architecturally impossible. That is good engineering.

3.2.1 Justification for the Proposed System

	The justification rests on four grounds. Technically, Node.js and MySQL are mature, well-supported technologies with a proven track record in high-traffic web applications at institutional and national scale. Economically, the aggregate cost of physical submission currently borne by Nigerian contractors across multiple tendering cycles each year represents a significant national economic loss that a functional e-bid portal would substantially reduce. Legally, the National Digital Economy and E-Governance Act of 2024 and NITDA's Software Development Guidelines both require government agencies to provide transactional digital services precisely of this type. Socially, removing the geographic and financial barriers of physical submission opens TETFund procurement to a broader pool of qualifying firms, particularly small and medium enterprises operating outside of Abuja.

3.3 Methodology Adopted

	This project uses the Agile Software Development Methodology as its governing development framework. Agile organises development into short, iterative cycles called Sprints. Each Sprint is time-boxed, typically to one or two weeks, and ends with a testable, potentially deployable increment of the system (Schwaber and Sutherland, 2020). The output of each Sprint is reviewed by stakeholders, and their feedback feeds directly into the planning of the next Sprint.

	The choice of Agile over alternative methodologies deserves explanation, because methodology choice is a substantive decision, not a formality.

	The Waterfall model was considered and rejected for a straightforward reason: the requirements of a government agency portal involving multiple user classes, external system integrations, and a real-time data component are too complex to fully specify upfront. Requirements will evolve. They always do. A Waterfall process that locks requirements at the start will produce a system that is already somewhat wrong before a line of code is written.

	The Prototype model was considered more seriously, since rapid prototyping has genuine value for UI-heavy projects like this one. Ultimately, Agile was preferred because it provides a more structured framework for managing the full development lifecycle, including backend logic, database design, and security implementation, not just the user-facing interface.

	Agile was selected because it accommodates evolving requirements without requiring a complete redesign at each iteration. It prioritises working software at each stage, which means the highest-value features, the real-time dashboard and the e-bid portal, can be delivered and reviewed early. And it aligns with the finding of Amara (2019) that Nigerian technology adoption goes better when users are involved in the development process rather than presented with a finished product.

3.3.1 Sprint Plan

The development of the proposed system is structured into five Sprints, each of two weeks' duration.

Sprint 1 (Foundation and Authentication): Node.js application skeleton setup, MySQL database initialisation, user registration and login system, and role-based access control middleware configuration.

Sprint 2 (Public Dashboard): Public-facing homepage, real-time news feed, active ITT listing with search and filter, and event calendar module.

Sprint 3 (E-Bid Portal): Contractor upload interface, mandatory category drop-down, server-side file validation, submission database recording, and automated email acknowledgment.

Sprint 4 (Admin and Converged Services): TETFund staff dashboard, bid management interface, submission review panel, and Single Sign-On gateway linking BIMS and TERAS.

Sprint 5 (Testing and Deployment): System integration testing, user acceptance testing with simulated contractor and admin profiles, performance optimisation, security hardening, and final deployment.

3.4 High-Level Model

	Three models are used to describe the architecture of the proposed system. Each model captures a different dimension: physical structure, functional behaviour, and data structure. Together, they give a complete picture.

3.4.1 Three-Tier Architecture

	The proposed system is structured as a three-tier web application. This is a standard and well-understood architectural pattern that separates the system into three distinct layers, each with a specific responsibility. The layers communicate with each other through well-defined interfaces, which means a change in one layer does not necessarily require changes in the others. This separation makes the system easier to maintain, test, and scale.

	The first tier is the Presentation Layer, the part of the system that users see and interact with in their web browser. It is built using HTML5, CSS3, and JavaScript. The layout is mobile-first, meaning it is designed for small screens and progressively enhanced for larger ones. The Presentation Layer does not contain any business logic. It sends HTTP requests to the Application Layer and renders the JSON responses it receives. Nothing more.

	The second tier is the Application Layer. This is where the actual logic of the system lives. It is built using Node.js with the Express.js framework. The Application Layer handles user authentication, validates uploaded files before writing them to the server, enforces role-based access control on every request, queries the database and formats the results, and dispatches acknowledgment emails after successful submissions. It is the most complex tier and the one that requires the most careful design.

	The third tier is the Data Layer. In production, this consists of a MySQL database server storing all structured records (user accounts, tender listings, submission metadata, news articles) and a server-side file system directory storing the actual uploaded bid documents. File paths are stored in the database rather than the files themselves, which is standard practice for maintaining database performance. In the local development environment, SQLite is used as a direct substitute for MySQL, requiring no separate server process and dramatically reducing the overhead of setting up and resetting the development environment.





3.4.2 Use Case Model

	The Use Case Model describes the system in terms of its actors and the actions each actor can perform. Three primary actors interact with the proposed system.

	The Contractor Actor is any registered company or individual seeking to submit a bid to TETFund. A Contractor can register and log in, browse the public dashboard to view active ITTs, download tender documents, complete the e-bid submission form, upload a bid document, and track the real-time status of their submitted bids.

	The Beneficiary Actor represents staff or students from TETFund beneficiary institutions. A Beneficiary can log in via the Single Sign-On gateway, be redirected to BIMS for identity verification or to TERAS for grant applications, and view relevant institutional announcements on the public dashboard.

	The Administrator Actor is a TETFund staff member authorised to manage the portal. An Administrator can publish and manage ITT listings, news articles, and event notices, access and review submitted bids organised by category, update the processing status of submissions, and generate summary reports of system activity.





3.5 System Specifications

3.5.1 Program Module Specification

	The proposed system is organised into four functional modules. Each module encapsulates a coherent set of related features and corresponds to a distinct operational area of the application.

	Module 1: Public Information Dashboard. This is the public-facing homepage, accessible without authentication. Its components are a live news feed, displaying the five most recent TETFund announcements without page refresh; a searchable and filterable Active ITT Board listing all open tenders with categories, closing dates, and downloadable bid documents; a TETFund events calendar; and a general announcements section. The module uses server-side rendering for initial page load and progressive enhancement for dynamic updates. Any visitor can use it.

	Module 2: Contractor Portal (E-Bid Module). This module handles the complete workflow for registered contractors, from account creation to bid submission. The core submission interface is a four-step form. Step 1 requires selection of the procurement category from a mandatory drop-down. The form cannot advance without a valid selection. Step 2 presents the specific sub-category and ITT reference number. Step 3 provides the file upload control, accepting only PDF and ZIP files up to 50MB. Step 4 is a review screen before final submission. On completion, the system records the submission in the database, generates a unique Submission ID, and dispatches an acknowledgment email to the contractor.

	Module 3: Administrator Dashboard. This module is accessible only to accounts with the Administrator role. It provides a content management interface for ITT listings, news articles, and event notices, as well as a submission inbox for each active tender, organised by category. Administrators can update the processing status of any submission and export summary reports to CSV.

	Module 4: Converged Services Gateway. This module implements the Single Sign-On mechanism that links the main TETFund portal to BIMS and TERAS. When a Beneficiary logs in using institutional credentials, the gateway authenticates them against the BIMS user store and issues a session token granting access to both the main portal and the TERAS grant application interface, without a second login. It is a small module with a disproportionately large impact on the user experience of beneficiary institutions.

3.5.2 Database Design and Entity-Relationship Model

	The database is a normalised relational database hosted on MySQL. The design follows Third Normal Form to eliminate redundancy and ensure referential integrity. Five primary tables constitute the schema.

	The USERS table is the central identity store for all accounts in the system, whether Contractor, Beneficiary, or Administrator. Each record holds the user's unique identifier, full name, email address (the login credential), a bcrypt-hashed password, the assigned role, account creation timestamp, and a status flag.

	The TENDERS table records all procurement opportunities published on the portal. Each tender record holds a unique TenderID, project title, description, procurement category, publishing date, closing deadline, status, path to the downloadable bid document, and a foreign key to the Administrator who created it.

	The SUBMISSIONS table is the system's most legally significant table. Each record holds a unique SubmissionID (communicated to the contractor as their acknowledgment reference), the submitting UserID, the target TenderID, the server-side path to the uploaded file, the precise submission timestamp, and the current processing status. The combination of UserID and TenderID is unique-constrained, preventing duplicate bids from the same firm for the same tender.

	The NEWS table stores all articles and announcements published on the public dashboard. Each record holds a NewsID, title, body content, an optional featured image path, the publication date, and a foreign key to the authoring Administrator.

	The AUDIT_LOG table maintains a permanent record of all significant system events: logins, submissions, status updates, and administrative actions. Each entry records the event type, acting UserID, affected record if any, timestamp, and originating IP address. This table is append-only; no existing record can be modified or deleted.





3.5.3 Data Dictionary

	The following tables present the complete data dictionary for the four primary database tables.

Table 3.1: USERS Table



Table 3.2: TENDERS Table



Table 3.3: SUBMISSIONS Table



Table 3.4: NEWS Table







3.5.4 Input and Output Design

	Input design in this system is governed by a single overriding principle: make correct input easy and incorrect input difficult. This is not only a usability principle; it is the mechanism through which the Wrong Box Problem is eliminated and other categories of submission error are minimised.

	Input Design: The registration and login forms collect user credentials with two layers of validation: client-side validation (email format checking, password strength requirements) provides immediate feedback, and server-side sanitisation prevents injection attacks regardless of what the client sends. The ITT management interface uses structured form fields with appropriate data type constraints, including date pickers for deadlines and enumerated drop-downs for category selection, so that malformed data cannot enter the database through the administrative interface. The e-bid submission form is the most carefully designed input mechanism in the system. Category selection is mandatory and validated on both the client and server sides. File type validation is performed first by checking the MIME type reported by the browser, and then independently on the server by inspecting the file's magic bytes, since a malicious user could rename an executable file with a .pdf extension. A 50MB file size limit is enforced at both layers.

	Output Design: The system produces outputs through five channels. The public dashboard renders active ITT listings, news articles, and event notices as fully responsive HTML pages. The submission process generates a formatted Submission Acknowledgment containing the Submission ID, contractor name, ITT reference, selected category, and precise timestamp, which is displayed on-screen and dispatched by email. The bid status tracker renders each contractor's submission history as a table with colour-coded status badges. The admin submission inbox renders received bids for any given tender as a sortable, filterable table. The audit log renders a chronological event record that can be exported to CSV.

3.5.5 Algorithm: E-Bid Submission Process

	The following pseudocode describes the server-side algorithm that processes a contractor's e-bid submission request. Every conditional branch reflects a specific documented failure mode from the existing manual system.



ALGORITHM: ProcessEBidSubmission

INPUT:  UserID, TenderID, CategorySelection, UploadedFile

OUTPUT: SubmissionID and Acknowledgment  OR  Error Message



BEGIN



  Step 1: Authenticate Request

    IF session token is invalid or expired THEN

      RETURN Error: 'Session expired. Please log in again.'

    END IF



  Step 2: Validate Category Selection

    IF CategorySelection is NULL

       OR CategorySelection NOT IN ('Works', 'Goods', 'Services') THEN

      RETURN Error: 'A valid procurement category must be selected.'

    END IF



  Step 3: Validate Uploaded File

    Check reported MIME type (client-side)

    Check file magic bytes (server-side)

    IF file is not PDF or ZIP THEN

      RETURN Error: 'Only PDF and ZIP files are accepted.'

    END IF

    IF UploadedFile.Size > 50MB THEN

      RETURN Error: 'File exceeds the 50MB size limit.'

    END IF



  Step 4: Check for Duplicate Submission

    QUERY SUBMISSIONS WHERE UserID = UserID AND TenderID = TenderID

    IF record exists THEN

      RETURN Error: 'A submission for this tender already exists for your account.'

    END IF



  Step 5: Check Tender Deadline

    QUERY TENDERS WHERE TenderID = TenderID

    IF CURRENT_TIMESTAMP > Tender.ClosingDate THEN

      RETURN Error: 'The closing date for this tender has passed.'

    END IF



  Step 6: Save File to Server

    Generate filename: UserID_TenderID_Timestamp.ext

    Write file to /uploads/submissions/

    SET FilePath = resulting server path



  Step 7: Insert Submission Record

    INSERT INTO SUBMISSIONS

      (UserID, TenderID, FilePath, Timestamp, Status)

    VALUES

      (UserID, TenderID, FilePath, CURRENT_TIMESTAMP, 'Received')

    SET SubmissionID = last inserted ID



  Step 8: Log the Event

    INSERT INTO AUDIT_LOG

      (EventType, UserID, AffectedRecord, Timestamp, IPAddress)

    VALUES

      ('Submission', UserID, SubmissionID, CURRENT_TIMESTAMP, RequestIP)



  Step 9: Dispatch Acknowledgment Email

    Compose email: SubmissionID, TenderTitle, Category, Timestamp

    SEND to User.Email via SMTP relay



  Step 10: Return Success Response

    RETURN SubmissionID, 'Your bid has been received successfully.'



END



3.6 System Flowchart

	The system flowchart maps the complete path of a contractor through the e-bid submission process, from the moment they arrive at the TETFund homepage to the moment they receive their digital acknowledgment. It is not a theoretical diagram. Every decision node in the flowchart corresponds to a real failure mode in the existing manual system, and the branches that exit those nodes toward error messages and recovery paths correspond to the protections that the proposed system builds in by design.

	The flow begins at the homepage. The system checks immediately whether the user has an active authenticated session. If not, they are redirected to the login page. On successful authentication, they return to their intended destination. This is standard session management, but it is worth noting that it is the point at which the system first enforces accountability: anonymous bid submissions are not possible.

	Once authenticated, the contractor selects an active ITT from the dashboard. The system presents the submission form. The first required action is category selection from the mandatory drop-down. If the contractor attempts to proceed without selecting a category, the form does not advance. There is no workaround. The contractor then uploads their document. The system validates the MIME type and file size at both the client and server sides. An invalid file type or an oversized file produces a specific error message and returns the contractor to the upload screen. On a valid upload, the file is saved, the submission record is inserted, the acknowledgment email is dispatched, and the contractor is shown a success screen with their Submission ID. The process ends when the contractor logs out.

	The flowchart also captures two secondary paths: the deadline-expired path, in which the system refuses submission after the ITT closing date and displays a clear explanation, and the duplicate-submission path, in which the system detects that the contractor already has a submission on record for that ITT and prevents a second upload.







3.7 Security Considerations

Security is not an afterthought in this design. A system that handles sensitive procurement documents on behalf of a major government agency, and that generates legally binding records of submission, must be secure by architecture rather than by assumption.

Password Hashing: All user passwords are hashed using bcrypt with a work factor of twelve before being written to the database. The plaintext password is discarded immediately after hashing and is never stored anywhere in the system.

Session Management: Authenticated sessions are managed using JSON Web Tokens with a one-hour expiry. Tokens are transmitted over HTTPS only and are invalidated on logout, preventing session hijacking through token reuse.

SQL Injection Prevention: All database queries are executed using parameterised statements through the Node.js MySQL2 library. No user-supplied input is ever interpolated directly into a SQL string.

File Upload Validation: File type checking is performed twice: once by the client-side JavaScript checking the reported MIME type, and once by the server inspecting the file's magic bytes independently of the filename extension. This prevents attackers from disguising executables as PDF files.

Role-Based Access Control: Every API endpoint is protected by middleware that reads the requester's role from their session token and refuses the request if the role does not match the endpoint's access requirements. A Contractor session cannot reach any Administrator endpoint, regardless of the URL.

HTTPS Enforcement: The production deployment redirects all HTTP traffic to HTTPS, ensuring that every byte exchanged between client and server is encrypted in transit.

3.8 Tools and Technologies

Each technology used in this project was chosen deliberately, for specific reasons, rather than by default.

Node.js (v20 LTS): Selected for its event-driven, non-blocking I/O model, which handles concurrent file upload requests from multiple contractors without creating a new thread per connection. Its npm ecosystem also provides mature, well-maintained libraries for every component of the application.

Express.js (v4): A minimal and flexible Node.js web framework providing the routing and middleware infrastructure for the RESTful API layer.

MySQL (v8): The production relational database, chosen for its ACID compliance, support for foreign key constraints, and widespread deployment in Nigerian enterprise environments.

SQLite (v3): The development database. It requires no separate server process, stores the entire database in a single file, and allows the development environment to be set up or reset in seconds.

HTML5, CSS3, JavaScript (ES6+): Standard web technologies for the Presentation Layer. The responsive layout uses CSS Flexbox and Grid, without heavy front-end frameworks, to minimise page load times on low-bandwidth connections.

Multer: A Node.js middleware library for handling multipart form data, used to manage the file upload process including size limit enforcement and temporary file storage.

Nodemailer: A Node.js library for dispatching the automated submission acknowledgment emails, configured to relay through the institutional SMTP server.

Visual Studio Code: The primary development editor, chosen for its integrated terminal, Git support, and extension ecosystem for Node.js development.



REFERENCES

Adegboye, I. A., & Salami, S. S. (2021). Usability of online student web portals in Nigerian tertiary institutions: Evidence from University of Ibadan. Journal of Science and Logics in ICT Research, 12(1), 45-60.

Adamu, M. S. (2022). Usability and user satisfaction of online administrative systems at IBB University. Nigerian Journal of Computing and Information Science, 8(2), 14-27.

Amara, T. (2019). Assessment of e-governance in the Nigerian tertiary educational system. International Journal of Humanities, Literature and Art Research, 10(6), 112-125.

Awofolaju, T., Okonkwo, E., & Eze, F. (2023). Scalability of Python-based government server architecture for high-concurrency public portals. African Journal of Computer Science and Information Systems, 5(1), 33-48.

Bello, A., Ibrahim, Y. M., Ibrahim, A. D., & Bala, K. (2019). Development of web-based e-tendering system for Nigerian public procuring entities. International Journal of Construction Management, 22(2), 278-291. https://doi.org/10.1080/15623599.2019.1620492

Bureau of Public Service Reforms (BPSR). (2025). Federal government unveils 2024/2025 MDA website scorecard. https://bpsr.gov.ng/

Ekoro, J., & Bassey, E. (2024). Robust web-based clearance and sessional tracking system for Colleges of Education. Journal of Educational Technology Systems, 3(1), 55-71.

Eweoya, I. O., Agbeyangi, A. O., & Lukose, D. (2024). Streamlining procurement: Real-time tracking and progress visualization in university web portals. Computer Science and Information Technology Journal, 12(4), 88-101.

Federal Republic of Nigeria. (2024). National Digital Economy and E-Governance Act. Federal Ministry of Communications, Innovation and Digital Economy.

Ibiyomi, T., Ajinaja, M., & Akeem, G. (2024). Electronic administration (E-Admin) for registry units in Nigerian tertiary institutions. Journal of Computing and Management Studies, 6(2), 19-34.

Jibril, A., & Umar, S. A. (2021). Biometric security integration in institutional web portals. Nigerian Journal of Information Technology, 9(1), 44-57.

Musa, U., Jaafar, M., & Raslim, F. M. (2023). E-procurement adoption in Nigeria: Perceptions from the public sector employees. Arab Gulf Journal of Scientific Research, 42(3), 1130-1149. https://doi.org/10.1108/AGJSR-10-2022-0224

National Information Technology Development Agency (NITDA). (2024). Software development guideline for Nigerian government entities. https://nitda.gov.ng/

Ojugo, A. A. (2018). Redesigning academic website for better visibility and footprint: A case of the Federal University of Petroleum Resources Effurun. Network and Communication Technologies, 3(1), 33-45.

Oniyangi, M., & Ibrahim, K. (2024). Procurement errors and disqualification in manual tendering: A case analysis of Nigerian public agencies. Journal of Public Administration and Policy Research, 16(2), 77-89.

Oshadami, R. (2025). Digital governance readiness in Nigerian government agencies: An empirical assessment. International Journal of E-Government Research, 21(1), 1-18.

Osunade, O., Adetimirin, A. E., & Asoro, B. O. (2024). A usability review of undergraduate student web portals at University of Ibadan. University of Ibadan Journal of Science and Logics in ICT Research, 12(1), 22-32.

Schwaber, K., & Sutherland, J. (2020). The Scrum guide: The definitive guide to Scrum: The rules of the game. Scrum.org. https://scrumguides.org/

Taiwo, O. O., & Faboya, O. P. (2025). Automated final year online clearance management system: A mobile-first approach. (B.Sc. Project Report). Federal University of Lafia.

Tertiary Education Trust Fund (TETFund). (2024). 2024 annual report and disbursement guidelines. https://tetfund.gov.ng/