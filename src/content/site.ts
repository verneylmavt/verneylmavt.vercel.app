export type IconName =
  | "Mail"
  | "Github"
  | "Linkedin"
  | "X"
  | "FileText"
  | "ExternalLink"
  | "ArrowUpRight"
  | "Code2"
  | "Code"
  | "CodeXml"
  | "Terminal"
  | "Server"
  | "Cloud"
  | "Cpu"
  | "Gpu"
  | "Database"
  | "DatabaseZap"
  | "Table"
  | "Palette"
  | "Sparkles"
  | "Atom"
  | "Layers"
  | "Link2"
  | "Bot"
  | "Wrench"
  | "Award"
  | "Briefcase"
  | "GraduationCap"
  | "Sigma"
  | "Brain"
  | "TrendingUp"
  | "Flame"
  | "Package"
  | "Container"
  | "Network"
  | "LineSquiggle"
  | "Box"
  | "Smile"
  | "Link"
  | "Star"
  | "ChartNetwork"
  | "Aperture"
  | "Zap";

export type ContactLink = {
  label: string;
  href: string;
  icon: IconName;
};

export type EducationItem = {
  institution: string;
  title: string;
  start: string;
  end: string;
  description?: string;
};

export type WorkExperienceItem = {
  company: string;
  companyUrl?: string;
  location?: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  highlights?: string[];
};

export type ToolItem = {
  name: string;
  icon: IconName;
};

export type CertificationItem = {
  title: string;
  issuer: string;
  date: string;
  badgeImagePath: string;
  proofUrl?: string;
};

export type ProjectItem = {
  slug: string;
  title: string;
  description: string;
  start: string;
  end: string;
  thumbnailPath: string;
  demoUrl?: string;
  repoUrl?: string;
  tags?: string[];
};

export type SiteContent = {
  name: string;
  handle: string;
  roleTitle: string;
  location?: string;
  contacts: ContactLink[];
  about: {
    paragraph: string;
    focus: Array<{ label: string; icon: IconName }>;
  };
  education: EducationItem[];
  workExperience: WorkExperienceItem[];
  tools: ToolItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
};

export const site: SiteContent = {
  name: "Elvern Neylmav Tanny",
  handle: "verneylmavt",
  roleTitle: "Data Scientist / AI Engineer",
  location: "Jakarta, Indonesia",
  contacts: [
    { label: "Email", href: "mailto:elvernneylmav@gmail.com", icon: "Mail" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/elvern-neylmav-t/",
      icon: "Linkedin",
    },
    { label: "GitHub", href: "https://github.com/verneylmavt", icon: "Github" },
    { label: "X", href: "https://x.com/verneylmavt", icon: "X" },
    // { label: "Resume", href: "https://example.com/resume.pdf", icon: "FileText" },
  ],
  about: {
    paragraph:
      "I enjoy building scalable cloud-native systems and applying data-driven insights to solve problems.",
    focus: [
      { label: "Product Design", icon: "Palette" },
      { label: "Backend Engineering", icon: "Database" },
      { label: "AI System", icon: "Cpu" },
    ],
  },
  education: [
    {
      institution: "Singapore University of Technology and Design (SUTD)",
      title: "BEng in Computer Science and Design",
      start: "2021",
      end: "2025",
      description:
        "Learning how computers work and teaching them how to learn.",
    },
    {
      institution: "Chalmers University of Technology",
      title: "BSc in Computer Science and Engineering",
      start: "2024",
      end: "2024",
      description:
        "Taking computer science on a trip to Sweden and bringing back a bit of Swedish culture.",
    },
  ],
  workExperience: [
    {
      company: "Mekari",
      companyUrl: "https://mekari.com",
      location: "Jakarta, Indonesia",
      title: "AI Engineer",
      start: "2026",
      end: "Present",
      summary:
        "Building the next layer of intelligence into a SaaS software powering millions.",
      // highlights: [
      //   "Built a token-driven UI system to align design and engineering",
      //   "Reduced time-to-ship by streamlining handoff and component reuse",
      //   "Improved performance and accessibility across key journeys",
      // ],
    },
    {
      company: "DB Schenker",
      companyUrl: "https://www.dbschenker.com",
      location: "Singapore",
      title: "Software Engineer",
      start: "2024",
      end: "2025",
      summary:
        "Mixing Al, project management, and logistics into one intelligent platform.",
    },
    {
      company: "Ernst & Young (EY)",
      companyUrl: "https://www.ey.com/en_sg",
      location: "Singapore",
      title: "Technology Consulting Intern",
      start: "2023",
      end: "2023",
      summary:
        "Connecting the dots across systems, processes, and data in M&A.",
    },
    {
      company: "Boeroe.id",
      // companyUrl: "https://www.ey.com/en_sg",
      location: "Surabaya, Indonesia",
      title: "Chief Everything Officer (CEO)",
      start: "2019",
      end: "2023",
      summary:
        "Building a business of eucalyptus oil from zero, wearing every hat from product to operations along the way.",
    },
  ],
  tools: [
    { name: "Python", icon: "LineSquiggle" },
    { name: "FastAPI", icon: "Zap" },
    { name: "NumPy", icon: "Sigma" },
    { name: "Pandas", icon: "Table" },
    { name: "Scikit-Learn", icon: "Brain" },
    { name: "XGBoost", icon: "TrendingUp" },
    { name: "PyTorch", icon: "Flame" },
    { name: "Transformers", icon: "Smile" },
    { name: "LangChain", icon: "Link" },
    { name: "n8n", icon: "ChartNetwork" },
    { name: "OpenAI SDK", icon: "Bot" },
    { name: "Claude Code", icon: "Bot" },
    { name: "Apache Spark", icon: "Star" },
    { name: "HTML / CSS / JS / TS", icon: "CodeXml" },
    { name: "React", icon: "Atom" },
    { name: "Node.js", icon: "Package" },
    { name: "SQL", icon: "Database" },
    { name: "NoSQL", icon: "DatabaseZap" },
    { name: "Docker", icon: "Container" },
    { name: "Kubernetes", icon: "Network" },
    { name: "NVIDIA", icon: "Gpu" },
    { name: "AWS", icon: "Cloud" },
  ],
  certifications: [
    {
      title: "AWS Certified CLF",
      issuer: "Amazon Web Services (AWS)",
      date: "2025-2028",
      badgeImagePath: "/badges/aws-clf.png",
      proofUrl: "https://www.credly.com/badges/3f3db845-9a3d-4c5f-82c4-0dfd1f41a149/public_url",
    },
    {
      title: "AWS Certified AIF",
      issuer: "Amazon Web Services (AWS)",
      date: "2025-2028",
      badgeImagePath: "/badges/aws-aif.png",
      proofUrl: "https://www.credly.com/badges/ae44fd6e-f626-4895-962f-1bc439bd8f85/public_url",
    },
    {
      title: "AWS Certified MLA",
      issuer: "Amazon Web Services (AWS)",
      date: "2025-2028",
      badgeImagePath: "/badges/aws-mla.png",
      proofUrl: "https://www.credly.com/badges/e6a64bac-af94-4d97-a7e8-8dd962fc5076/public_url",
    },
    {
      title: "AWS Certified MLS",
      issuer: "Amazon Web Services (AWS)",
      date: "2025-2028",
      badgeImagePath: "/badges/aws-mls.png",
      proofUrl: "https://www.credly.com/badges/9d542062-136f-44bc-829e-5c0ceb2444d1/public_url",
    },
  ],
  projects: [
    {
      slug: "sc",
      title: "SUTD Chatbot",
      description:
        "Fine-tuned university chatbot with Retrieval-Augmented Generation (RAG).",
      start: "2025",
      end: "2025",
      thumbnailPath: "/projects/sc.png",
      // demoUrl: "https://example.com",
      repoUrl: "https://github.com/verneylmavt/sutd_5055mlop",
      tags: ["School Project", "AI/ML", "RAG", "LangChain", "vLLM"],
    },
    {
      slug: "bsp",
      title: "Blood Sugar Prediction",
      description:
        "Time-series glucose forecasting using Temporal Convolutional Networks (TCN).",
      start: "2025",
      end: "2025",
      thumbnailPath: "/projects/bsp.png",
      demoUrl: "https://g20-blood-sugar-spike-prediction.streamlit.app/",
      repoUrl: "https://github.com/verneylmavt/st-blood-sugar-spike-prediction",
      tags: ["School Project", "AI/ML", "NumPy", "Pandas", "PyTorch"],
    },
    {
      slug: "fmc",
      title: "FindMyCar: Parking Management System",
      description:
        "IoT-based smart parking system with OCR-driven license plate recognition and real-time tracking.",
      start: "2024",
      end: "2024",
      thumbnailPath: "/projects/fmc.png",
      // demoUrl: "https://example.com",
      repoUrl: "https://github.com/Collaboration95/FindMyCar_50.046",
      tags: ["School Project", "Web App", "Raspberry Pi", "MQTT", "WebSockets", "React", "Node.js"],
    },
    {
      slug: "sa",
      title: "Sentiment Analysis",
      description:
        "Context-aware sentiment analysis using convolutional, recurrent, and attention architectures.",
      start: "2024",
      end: "2024",
      thumbnailPath: "/projects/sa.png",
      demoUrl: "https://verneylogyt-snt-analysis.streamlit.app/",
      repoUrl: "https://github.com/T2LIPthedeveloper/50.040-NLP-Final-Project",
      tags: ["School Project", "AI/ML", "NumPy", "Pandas", "FastText", "PyTorch", "ONNX"],
    },
    {
      slug: "ta",
      title: "Text Analysis",
      description:
        "Probabilistic sequence modeling for sentiment classification using HMMs.",
      start: "2023",
      end: "2023",
      thumbnailPath: "/projects/ta.png",
      // demoUrl: "https://example.com",
      repoUrl: "https://github.com/verneylmavt/hmm-text_analysis-py",
      tags: ["School Project", "AI/ML", "NumPy", "Pandas", "Scikit-Learn"],
    },
    {
      slug: "ims",
      title: "Invoice Management System",
      description:
        "Invoice digitization and management system with automated data extraction and search.",
      start: "2023",
      end: "2023",
      thumbnailPath: "/projects/ims.png",
      demoUrl: "https://youtu.be/ZvkS2uVExVo",
      repoUrl: "https://github.com/DeProfessorA/construct-software-wow",
      tags: ["School Project", "Web App", "Svelte", "Node.js"],
    },
    {
      slug: "dt",
      title: "Digital Trails: Smart Tour Guide",
      description:
        "NFC-enabled smart tour guide system with real-time contextual recommendations.",
      start: "2023",
      end: "2023",
      thumbnailPath: "/projects/dt.png",
      demoUrl: "https://youtu.be/REjeYuMzRts",
      repoUrl: "https://github.com/nigelpoh/Digital-Trail-App",
      tags: ["School Project", "Mobile App", "Java", "Kotlin"],
    },
    {
      slug: "bav",
      title: "Bible Analysis & Visualization",
      description:
        "Multi-dimensional biblical data analysis with text, network, timeline, and geospatial modeling.",
      start: "2024",
      end: "2025",
      thumbnailPath: "/projects/bav.png",
      demoUrl: "https://verneylogyt-kjv-vis.streamlit.app/",
      repoUrl: "https://github.com/verneylmavt/st-kjv-vis",
      tags: ["Personal Project", "AI/ML", "NumPy", "Pandas", "Plotly", "NetworkX", "Scikit-Learn", "Streamlit"],
    },
    {
      slug: "nav",
      title: "NBA Analysis & Visualization",
      description:
        "Multi-task NBA player analytics with regression, classification, and embedding-based similarity modeling.",
      start: "2024",
      end: "2025",
      thumbnailPath: "/projects/nav.png",
      demoUrl: "https://verneylogyt-nba-vis.streamlit.app/",
      repoUrl: "https://github.com/verneylmavt/st-nba-vis",
      tags: ["Personal Project", "AI/ML", "NumPy", "Pandas", "Plotly", "Scikit-Learn", "Streamlit"],
    },
    {
      slug: "mrs",
      title: "Movie Recommender System",
      description:
        "Neural collaborative filtering–based movie recommender with embedding learning and MLP modeling.",
      start: "2024",
      end: "2025",
      thumbnailPath: "/projects/mrs.png",
      demoUrl: "https://verneylogyt-mov-recsys.streamlit.app/",
      repoUrl: "https://github.com/verneylmavt/st-mov-recsys",
      tags: ["Personal Project", "AI/ML", "NumPy", "Pandas", "PyTorch", "Streamlit"],
    },
    {
      slug: "rg",
      title: "Recipe Generator",
      description:
        "AI-powered recipe generation system with ingredient and image-based inputs.",
      start: "2024",
      end: "2024",
      thumbnailPath: "/projects/rg.png",
      // demoUrl: "https://verneylogyt-mov-recsys.streamlit.app/",
      repoUrl: "https://github.com/verneylmavt/recipe-generator",
      tags: ["Personal Project", "AI/ML", "Web App"],
    },
  ],
};

export default site;
