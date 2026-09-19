/**
 * THE LAST SIGNAL - Case Data & State Definitions
 * Case #0471: Disappearance of Elias Vale
 */

const CASE_DATA = {
  meta: {
    id: "CASE #0471",
    title: "THE LAST SIGNAL",
    subject: "Elias Vale",
    age: 38,
    occupation: "Senior Researcher, Quantum Signal Dynamics (Project AETHER)",
    status: "MISSING",
    lastLocation: "Blackwood Research Facility - Sector 4",
    lastMessage: "“Don't trust the person who finds me.”",
    briefingText: `At 02:31 AM, senior quantum researcher Elias Vale sent a single encrypted alert from Blackwood Facility before all facility telemetry abruptly cut out. Security archives from the night of the incident show signs of physical tampering and deleted access logs. Four individuals with high-level access remain in the facility grid. Your task: uncover what happened to Elias Vale, solve the encrypted security barriers, assemble the evidence board, and make the definitive accusation.`
  },

  locations: [
    {
      id: "loc_facility",
      name: "Blackwood Research Facility",
      tagline: "Main Lab & Core Quantum Server Room",
      icon: "fa-flask",
      bgStyle: "linear-gradient(135deg, rgba(16, 24, 38, 0.95), rgba(10, 14, 23, 0.98))",
      description: "A state-of-the-art quantum physics research facility. High voltage humming fills the sterile dark air.",
      hotspots: [
        {
          id: "hs_facility_terminal",
          name: "Security Terminal",
          icon: "fa-desktop",
          top: "35%",
          left: "22%",
          discoveredClueId: "clue_01",
          examineText: "The main terminal is locked with a high-security access code. A prompt flashes: ENTER 4-DIGIT AUTHORIZATION."
        },
        {
          id: "hs_facility_desk",
          name: "Elias's Desk",
          icon: "fa-briefcase",
          top: "55%",
          left: "48%",
          discoveredClueId: "clue_02",
          examineText: "Scatterings of quantum equation blueprints. An open leather diary lies facedown next to a shattered coffee mug."
        },
        {
          id: "hs_facility_window",
          name: "Broken Window Frame",
          icon: "fa-shield-halved",
          top: "28%",
          left: "75%",
          discoveredClueId: "clue_03",
          examineText: "A reinforced glass panel fractured from the inside. Subtle black scuff marks line the sill."
        },
        {
          id: "hs_facility_photo",
          name: "Strange Photograph",
          icon: "fa-image",
          top: "68%",
          left: "18%",
          discoveredClueId: "clue_04",
          examineText: "A faded Polaroid showing Elias standing outside the Rooftop Observatory with a masked figure."
        }
      ]
    },
    {
      id: "loc_apartment",
      name: "Elias's Apartment",
      tagline: "Off-site Private Residence",
      icon: "fa-building-user",
      bgStyle: "linear-gradient(135deg, rgba(20, 16, 28, 0.95), rgba(12, 10, 20, 0.98))",
      description: "An isolated apartment in the financial district. Books on cryptanalysis and quantum mechanics litter the floor.",
      hotspots: [
        {
          id: "hs_apt_laptop",
          name: "Encrypted Laptop",
          icon: "fa-laptop-code",
          top: "42%",
          left: "30%",
          discoveredClueId: "clue_05",
          examineText: "An unbranded military-grade laptop running an active packet sniffer. It requires a cipher code to unlock."
        },
        {
          id: "hs_apt_safe",
          name: "Hidden Wall Safe",
          icon: "fa-vault",
          top: "25%",
          left: "65%",
          discoveredClueId: "clue_06",
          examineText: "Concealed behind a canvas painting. Contains financial wire transfers and urgent withdrawal notices."
        },
        {
          id: "hs_apt_prescription",
          name: "Prescription Bottle",
          icon: "fa-pills",
          top: "70%",
          left: "52%",
          discoveredClueId: "clue_15",
          examineText: "A bottle of heavy sedative prescribed to Elias. Surprisingly, the bottle is completely full."
        }
      ]
    },
    {
      id: "loc_security",
      name: "Security Office",
      tagline: "Facility Surveillance Hub",
      icon: "fa-video",
      bgStyle: "linear-gradient(135deg, rgba(24, 18, 16, 0.95), rgba(16, 10, 10, 0.98))",
      description: "Walls of CCTV monitors flicker with static. Access keycards and security logs sit on the desk.",
      hotspots: [
        {
          id: "hs_sec_footage",
          name: "Corrupted CCTV Server",
          icon: "fa-film",
          top: "38%",
          left: "40%",
          discoveredClueId: "clue_07",
          examineText: "A 17-second section of footage from 02:17 AM was manually purged using Chief Security overrides."
        },
        {
          id: "hs_sec_keycard",
          name: "Dropped Access Card",
          icon: "fa-id-card",
          top: "65%",
          left: "25%",
          discoveredClueId: "clue_08",
          examineText: "A high-clearance keycard slipped beneath the server rack. Printed name: 'ADRIAN CROSS - LEVEL 4'."
        },
        {
          id: "hs_sec_log",
          name: "Security Entry Registry",
          icon: "fa-clipboard-list",
          top: "50%",
          left: "72%",
          discoveredClueId: "clue_09",
          examineText: "Paper sign-in log shows manual override badge check at 00:41 AM under badge ID #992."
        }
      ]
    },
    {
      id: "loc_archive",
      name: "Underground Archive",
      tagline: "Classified Project Vault B-3",
      icon: "fa-database",
      bgStyle: "linear-gradient(135deg, rgba(14, 24, 24, 0.95), rgba(8, 16, 16, 0.98))",
      description: "Sub-basement storage housing cold-storage servers and confidential corporate files.",
      hotspots: [
        {
          id: "hs_arch_drive",
          name: "Damaged Quantum Storage Drive",
          icon: "fa-hard-drive",
          top: "45%",
          left: "35%",
          discoveredClueId: "clue_10",
          examineText: "A heavily shielded SSD containing backup telemetry of Project AETHER. Half the sectors are thermal-scared."
        },
        {
          id: "hs_arch_dossier",
          name: "Redacted Corporate Dossier",
          icon: "fa-file-shield",
          top: "60%",
          left: "60%",
          discoveredClueId: "clue_11",
          examineText: "Classification stamp: AETHER CORP EXECUTIVE EYES ONLY. Details buy-out terms and buyout threats."
        }
      ]
    },
    {
      id: "loc_observatory",
      name: "Rooftop Observatory",
      tagline: "Deep Signal Transmission Tower",
      icon: "fa-tower-cell",
      bgStyle: "linear-gradient(135deg, rgba(22, 16, 32, 0.95), rgba(12, 8, 20, 0.98))",
      description: "Open air atop the research building. High frequency array dishes point into the night sky.",
      hotspots: [
        {
          id: "hs_obs_receiver",
          name: "Quantum Signal Receiver",
          icon: "fa-satellite-dish",
          top: "30%",
          left: "50%",
          discoveredClueId: "clue_12",
          examineText: "The receiver was active until 02:30 AM, beaming data to an offshore hidden server."
        },
        {
          id: "hs_obs_note",
          name: "Elias's Final Encrypted Cipher",
          icon: "fa-scroll",
          top: "58%",
          left: "28%",
          discoveredClueId: "clue_13",
          examineText: "A handwritten piece of waterproof parchment containing encoded ciphertext."
        },
        {
          id: "hs_obs_footprints",
          name: "Disturbed Dust & Footprints",
          icon: "fa-shoe-prints",
          top: "72%",
          left: "70%",
          discoveredClueId: "clue_14",
          examineText: "Two pairs of boot prints leading up to the rooftop elevator hatch. Signs of a quick struggle."
        }
      ]
    }
  ],

  clues: [
    {
      id: "clue_01",
      name: "Terminal Passcode Clue",
      location: "Blackwood Research Facility",
      importance: "HIGH",
      icon: "fa-key",
      description: "A sticky note hidden under the terminal keyboard: 'Lab anniversary (04/17) + Sector ID (23)'. Suggests a 4-digit code: 0417.",
      suspects: ["Adrian Cross"],
      unlockedBy: null
    },
    {
      id: "clue_02",
      name: "Elias's Research Journal",
      location: "Blackwood Research Facility",
      importance: "CRITICAL",
      icon: "fa-book-journal-whills",
      description: "Journal entry dated yesterday: 'Adrian is trying to copy the signal key. If I don't sign over Project AETHER to Hale, they will wipe the lab.'",
      suspects: ["Adrian Cross", "Victor Hale"],
      unlockedBy: null
    },
    {
      id: "clue_03",
      name: "Fractured Glass & Scuff Marks",
      location: "Blackwood Research Facility",
      importance: "MEDIUM",
      icon: "fa-glass-water-droplet",
      description: "Impact marks indicate glass broken from inside out. Black rubber soles matching tactical security boots.",
      suspects: ["Marcus Reed"],
      unlockedBy: null
    },
    {
      id: "clue_04",
      name: "Observatory Photograph",
      location: "Blackwood Research Facility",
      importance: "MEDIUM",
      icon: "fa-image",
      description: "Photograph of Elias with a shadowy figure wearing a tailored suit ring with the initials 'V.H.'",
      suspects: ["Victor Hale"],
      unlockedBy: null
    },
    {
      id: "clue_05",
      name: "Encrypted Laptop Log",
      location: "Elias's Apartment",
      importance: "HIGH",
      icon: "fa-laptop",
      description: "Packet sniffer captured incoming traffic from Victor Hale's IP address threatening legal action and police warrants.",
      suspects: ["Victor Hale"],
      unlockedBy: "puzzle_cipher"
    },
    {
      id: "clue_06",
      name: "Offshore Wire Receipt",
      location: "Elias's Apartment",
      importance: "HIGH",
      icon: "fa-file-invoice-dollar",
      description: "A transfer receipt for $250,000 sent from Lena Vale to an offshore escrow account 3 days prior.",
      suspects: ["Lena Vale"],
      unlockedBy: null
    },
    {
      id: "clue_07",
      name: "Purged CCTV Footage",
      location: "Security Office",
      importance: "CRITICAL",
      icon: "fa-video-slash",
      description: "Security archive log showing 17 minutes deleted at 02:17 AM using Security Master Code #01.",
      suspects: ["Marcus Reed"],
      unlockedBy: null
    },
    {
      id: "clue_08",
      name: "Adrian's Dropped Level 4 Card",
      location: "Security Office",
      importance: "CRITICAL",
      icon: "fa-id-badge",
      description: "Level 4 access keycard found behind security rack. Access timestamp logs entry at 00:41 AM.",
      suspects: ["Adrian Cross"],
      unlockedBy: null
    },
    {
      id: "clue_09",
      name: "Manual Gate Sign-in Log",
      location: "Security Office",
      importance: "MEDIUM",
      icon: "fa-pen-to-square",
      description: "Sign-in book showing Lena Vale visited the facility at 22:05 PM and departed at 22:45 PM.",
      suspects: ["Lena Vale"],
      unlockedBy: null
    },
    {
      id: "clue_10",
      name: "Damaged Quantum SSD",
      location: "Underground Archive",
      importance: "HIGH",
      icon: "fa-hard-drive",
      description: "SSD containing raw code of Project AETHER. Portions of the memory were copied to an external flash drive at 01:56 AM.",
      suspects: ["Adrian Cross"],
      unlockedBy: null
    },
    {
      id: "clue_11",
      name: "Redacted Buyout Agreement",
      location: "Underground Archive",
      importance: "CRITICAL",
      icon: "fa-file-contract",
      description: "Contract offering Elias $5 Million for his research. If refused, clause 9 states 'forceful patent acquisition'. Signed by Victor Hale.",
      suspects: ["Victor Hale"],
      unlockedBy: "puzzle_scanner"
    },
    {
      id: "clue_12",
      name: "Satellite Transmission Log",
      location: "Rooftop Observatory",
      importance: "HIGH",
      icon: "fa-signal",
      description: "Log showing a 40-gigabyte upload at 02:30 AM to satellite cluster 'AETHER-9'. Upload was interrupted mid-transmission.",
      suspects: ["Adrian Cross", "Elias Vale"],
      unlockedBy: null
    },
    {
      id: "clue_13",
      name: "Decoded Encrypted Parchment",
      location: "Rooftop Observatory",
      importance: "CRITICAL",
      icon: "fa-user-secret",
      description: "Cipher text decoded to: 'THE OBSERVATORY KNOWS. ADRIAN TOOK THE DRIVE. I TRANSMITTED THE REAL KEY TO THE ARCHIVE.'",
      suspects: ["Adrian Cross"],
      unlockedBy: "puzzle_cipher"
    },
    {
      id: "clue_14",
      name: "Dual Bootprints on Rooftop",
      location: "Rooftop Observatory",
      importance: "MEDIUM",
      icon: "fa-shoe-prints",
      description: "Boot prints matching Marcus Reed (size 11 security boot) and Adrian Cross (size 9 dress shoe) near the elevator ledge.",
      suspects: ["Marcus Reed", "Adrian Cross"],
      unlockedBy: null
    },
    {
      id: "clue_15",
      name: "Intact Sedative Medication",
      location: "Elias's Apartment",
      importance: "LOW",
      icon: "fa-pills",
      description: "Disproves theory that Elias was incapacitated by medication or suicide; bottle remains sealed.",
      suspects: [],
      unlockedBy: null
    }
  ],

  suspects: [
    {
      id: "suspect_marcus",
      name: "Marcus Reed",
      role: "Former Security Chief",
      avatar: "assets/images/marcus.jpg",
      personality: "Calm, defensive, protective, secretive.",
      motive: "Had full master access to facility surveillance and access control doors.",
      suspicionLevel: 65,
      background: "Ex-military tactical operative turned chief of security for Blackwood. Disliked Elias's constant midnight experiments.",
      timeline: [
        "21:30 - Started night shift rounds",
        "00:41 - Logged Adrian Cross into Sector 4",
        "02:17 - Master security override code used on CCTV server",
        "02:35 - Discovered missing alarm flag on rooftop"
      ],
      statements: [
        {
          id: "m_st_1",
          question: "Where were you at 02:17 AM when the camera footage was deleted?",
          answer: "I was patrolling the lower archive corridor. The CCTV server must have glitched or auto-purged like it sometimes does."
        },
        {
          id: "m_st_2",
          question: "Why did you allow Adrian Cross entry at 00:41 AM?",
          answer: "Cross had Level 4 access clearance signed by Victor Hale himself. I don't question corporate executives."
        },
        {
          id: "m_st_3",
          question: "What happened on the rooftop observatory?",
          answer: "I ran up when the telemetry failed at 02:31 AM. Found the receiver humming and the roof hatch wide open. Nobody was there."
        }
      ],
      confrontations: [
        {
          clueId: "clue_07",
          triggerQuestion: "You claim the server auto-purged, but Clue #07 proves your Master Security Code #01 deleted the footage at 02:17 AM!",
          suspectResponse: "...Dammit. Fine. Victor Hale paid me $50,000 to turn off the cameras for 20 minutes so Adrian could retrieve the drive without witnesses. But I didn't harm Elias!",
          suspicionChange: -15,
          revealsFact: "Marcus was bribed by Victor Hale to disable security cameras for Adrian."
        },
        {
          clueId: "clue_14",
          triggerQuestion: "We found your size 11 tactical bootprints alongside Adrian's shoes on the rooftop!",
          suspectResponse: "I went up there after hearing a gunshot sound! I saw Adrian forcing Elias toward the emergency stairwell with a drive in his hand!",
          suspicionChange: -20,
          revealsFact: "Marcus witnessed Adrian confronting Elias at gunpoint."
        }
      ]
    },

    {
      id: "suspect_lena",
      name: "Lena Vale",
      role: "Elias's Sister / Financial Auditor",
      avatar: "assets/images/lena.jpg",
      personality: "Emotional, protective, highly intelligent, persistent.",
      motive: "Involved in a major financial transaction with Elias preceding his disappearance.",
      suspicionLevel: 45,
      background: "A certified forensic accountant. She managed Elias's personal estate after their father passed away.",
      timeline: [
        "22:05 - Arrived at Blackwood Facility to visit Elias",
        "22:45 - Signed out of facility registry",
        "23:30 - Returned home and sent encrypted email to Elias"
      ],
      statements: [
        {
          id: "l_st_1",
          question: "Why did you visit Elias at Blackwood late last night?",
          answer: "Elias called me terrified. He said Victor Hale was threatening to seize his research and destroy his reputation."
        },
        {
          id: "l_st_2",
          question: "We found a $250,000 wire receipt from your account. Explain that.",
          answer: "Elias needed emergency funds to buy an encrypted satellite node to transmit Project AETHER out of Hale's reach!"
        }
      ],
      confrontations: [
        {
          clueId: "clue_06",
          triggerQuestion: "This $250,000 transfer receipt looks like a buyout settlement.",
          suspectResponse: "Look at the recipient address! It was sent to an independent orbital bandwidth provider. I was helping my brother escape corporate theft!",
          suspicionChange: -25,
          revealsFact: "Lena funded Elias's secret orbital satellite data backup."
        }
      ]
    },

    {
      id: "suspect_adrian",
      name: "Adrian Cross",
      role: "Senior Research Partner",
      avatar: "assets/images/adrian.jpg",
      personality: "Charismatic, persuasive, smooth-talking, evasive.",
      motive: "Coveted full sole-author credit for Project AETHER and corporate backing.",
      suspicionLevel: 85,
      background: "Co-developer of Quantum Signal tech. Resented Elias getting primary recognition in academic journals.",
      timeline: [
        "00:41 - Entered facility under emergency clearance",
        "01:56 - Accessed underground vault server B-3",
        "02:17 - Present in core lab during camera blackout",
        "02:30 - Escalated rooftop confrontation"
      ],
      statements: [
        {
          id: "a_st_1",
          question: "What were you doing at the facility after midnight?",
          answer: "I was running late-night thermal calibration tests on the quantum receiver. Perfectly routine work."
        },
        {
          id: "a_st_2",
          question: "Did you talk to Elias before he vanished?",
          answer: "Elias left early around 21:30 PM. I never saw him again after he packed his briefcase."
        }
      ],
      confrontations: [
        {
          clueId: "clue_08",
          triggerQuestion: "We found your Level 4 access keycard dropped in the security room right at 00:41 AM!",
          suspectResponse: "I... I lost my card earlier in the evening! Anyone could have picked it up and used it!",
          suspicionChange: +10,
          revealsFact: "Adrian lies about losing his keycard."
        },
        {
          clueId: "clue_13",
          triggerQuestion: "Elias's decoded cipher explicitly says: 'ADRIAN TOOK THE DRIVE. I TRANSMITTED THE REAL KEY TO THE ARCHIVE.'",
          suspectResponse: "(Sweating) That's a fabrication! Elias was losing his mind! He was trying to ruin our corporate deal with Victor Hale!",
          suspicionChange: +15,
          revealsFact: "Adrian stole the quantum drive and ambushed Elias."
        }
      ]
    },

    {
      id: "suspect_victor",
      name: "Victor Hale",
      role: "CEO / Corporate Director, AETHER Corp",
      avatar: "assets/images/victor.jpg",
      personality: "Cold, calculating, ruthless, authoritative.",
      motive: "Project AETHER is valued at $100 Million for defense intelligence applications.",
      suspicionLevel: 75,
      background: "Billionaire tech mogul who financed Blackwood Facility. Demanded absolute ownership of all research output.",
      timeline: [
        "20:00 - Issued final acquisition ultimatum to Elias",
        "01:00 - Wire transfer sent to Marcus Reed",
        "02:40 - Received notification of data transmission failure"
      ],
      statements: [
        {
          id: "v_st_1",
          question: "Did you threaten Elias regarding Project AETHER?",
          answer: "I am a businessman. I reminded Dr. Vale of his contractual obligations to AETHER Corp. Nothing more."
        },
        {
          id: "v_st_2",
          question: "What is your relationship with Adrian Cross?",
          answer: "Dr. Cross understands the pragmatic realities of commercial technology. He is a valued associate."
        }
      ],
      confrontations: [
        {
          clueId: "clue_11",
          triggerQuestion: "Your redacted agreement threatens 'forceful patent acquisition' if Elias refused to hand over his work.",
          suspectResponse: "Standard legal boilerplate. My attorneys handle contract phrasing. I don't get my hands dirty with lab squabbles.",
          suspicionChange: 0,
          revealsFact: "Victor Hale orchestrated the coercive buyout attempt."
        }
      ]
    }
  ],

  puzzles: [
    {
      id: "puzzle_keypad",
      title: "Security Terminal Access Code",
      type: "keypad",
      location: "Blackwood Research Facility",
      clueIdYield: "clue_01",
      hint: "Check Elias's Sticky Note: Lab Anniversary (04/17) + Sector ID (23). Code is 4 digits.",
      solution: "0417"
    },
    {
      id: "puzzle_cipher",
      title: "Encrypted Parchment Decipher Tool",
      type: "cipher",
      location: "Rooftop Observatory",
      clueIdYield: "clue_13",
      ciphertext: "WKH REVHUYDWRUB NQRZV",
      shift: 3,
      hint: "Caesar cipher with shift -3. (W -> T, K -> H, H -> E)",
      solution: "THE OBSERVATORY KNOWS"
    },
    {
      id: "puzzle_scanner",
      title: "Corrupted Redaction Scanner",
      type: "scanner",
      location: "Underground Archive",
      clueIdYield: "clue_11",
      hint: "Use the UV frequency slider (Set to 365 nm) and click the 3 hidden thermal spots to reveal redacted terms.",
      targetFrequency: 365,
      spotsToReveal: 3
    }
  ],

  timeline: [
    { time: "21:30 PM", text: "Elias finishes primary quantum calibration.", visible: true, clueRef: null },
    { time: "22:05 PM", text: "Lena Vale signs into Blackwood entrance gate.", visible: true, clueRef: "clue_09" },
    { time: "00:41 AM", text: "Adrian Cross enters facility under badge #992.", visible: false, clueRef: "clue_08" },
    { time: "01:56 AM", text: "Quantum SSD contents copied in Underground Vault.", visible: false, clueRef: "clue_10" },
    { time: "02:17 AM", text: "17 minutes of CCTV security footage purged.", visible: false, clueRef: "clue_07" },
    { time: "02:30 AM", text: "Orbital upload interrupted at Rooftop Observatory.", visible: false, clueRef: "clue_12" },
    { time: "02:31 AM", text: "Elias sends final encrypted signal: 'Don't trust the person who finds me.'", visible: true, clueRef: null }
  ],

  messages: [
    {
      id: "msg_1",
      sender: "Lena Vale",
      receiver: "Elias Vale",
      timestamp: "22:12 PM",
      preview: "The escrow transfer went through. Be careful...",
      body: "Elias, $250,000 is now in the satellite uplink account. If Hale discovers what you're transmitting, he won't let you leave the building. Call me as soon as the signal locks.",
      locked: false
    },
    {
      id: "msg_2",
      sender: "Victor Hale",
      receiver: "Elias Vale",
      timestamp: "20:15 PM",
      preview: "Final warning regarding Project AETHER.",
      body: "Dr. Vale, your insistence on keeping the quantum key public is unacceptable. Adrian has already agreed to our terms. You have until midnight to hand over the primary drive.",
      locked: false
    },
    {
      id: "msg_3",
      sender: "Adrian Cross",
      receiver: "Marcus Reed",
      timestamp: "01:10 AM",
      preview: "Ensure the cameras are clear at 02:15.",
      body: "Chief Reed, Hale confirmed your transfer. Make sure Sector 4 CCTV goes dark from 02:15 to 02:30 AM. I will handle Elias.",
      locked: true,
      unlockClueId: "clue_07"
    }
  ],

  boardConnections: [
    {
      id: "conn_1",
      nodeA: "clue_07", // Purged CCTV
      nodeB: "suspect_marcus",
      deductionTitle: "UNAUTHORIZED SURVEILLANCE ERASURE",
      deductionText: "Marcus Reed actively used his Master Code to wipe security footage, covering Adrian Cross's entrance.",
      progressBonus: 15
    },
    {
      id: "conn_2",
      nodeA: "clue_08", // Adrian's keycard
      nodeB: "suspect_adrian",
      deductionTitle: "UNAUTHORIZED NIGHT LAB ENTRY",
      deductionText: "Adrian Cross lied about his whereabouts, entering Sector 4 after midnight to steal the quantum drive.",
      progressBonus: 20
    },
    {
      id: "conn_3",
      nodeA: "clue_11", // Redacted Buyout
      nodeB: "suspect_victor",
      deductionTitle: "CORPORATE COERCION CONSPIRACY",
      deductionText: "Victor Hale bribed security staff and threatened Elias to forcibly acquire Project AETHER.",
      progressBonus: 15
    },
    {
      id: "conn_4",
      nodeA: "clue_13", // Decoded Parchment
      nodeB: "clue_12", // Transmission log
      deductionTitle: "ORBITAL DATA ESCAPE",
      deductionText: "Elias succeeded in beaming the master quantum key to a public orbital satellite before Adrian attacked.",
      progressBonus: 20
    }
  ],

  endings: {
    TRUE_ENDING: {
      type: "TRUE ENDING",
      title: "THE SIGNAL SURVIVES",
      badge: "CASE SOLVED - FULL DEDUCTION",
      badgeClass: "badge-success",
      description: `Your investigation exposed the complete chain of events. Adrian Cross ambushed Elias on the Rooftop Observatory to steal the physical quantum drive under orders from corporate mogul Victor Hale. Security Chief Marcus Reed accepted a $50,000 bribe to erase CCTV archives.\n\nHowever, Elias outsmarted them: before Adrian could secure the drive, Elias transmitted the master decryption key to Lena's orbital satellite dish and went into hidden protective custody with federal agents.\n\nAdrian Cross and Marcus Reed were arrested at dawn. Victor Hale faces federal corporate espionage charges.`
    },
    SECRET_ENDING: {
      type: "SECRET ENDING",
      title: "PROJECT AETHER UNLEASHED",
      badge: "GLOBAL CONSPIRACY EXPOSED",
      badgeClass: "badge-warning",
      description: `By solving all 3 cryptographic puzzles and connecting the orbital logs, you unlocked the encrypted terminal files in Vault B-3.\n\nElias Vale didn't just escape—he broadcast Project AETHER open-source to thousands of research universities across the globe simultaneously. The corporate monopolies over quantum surveillance collapsed overnight.`
    },
    WRONG_ACCUSATION: {
      type: "WRONG ACCUSATION",
      title: "MISCARRIAGE OF JUSTICE",
      badge: "CASE FAILED - INCORRECT CULPRIT",
      badgeClass: "badge-danger",
      description: `You submitted an accusation without sufficient evidence against the true perpetrator. High-priced defense attorneys dismantled your case in court.\n\nThe real perpetrators destroyed the remaining telemetry files, and Elias Vale's whereabouts remain an unsolved cold case mystery.`
    },
    INCOMPLETE_CASE: {
      type: "INCOMPLETE CASE",
      title: "INSUFFICIENT EVIDENCE",
      badge: "CASE INCOMPLETE",
      badgeClass: "badge-secondary",
      description: `You rushed to close the case before discovering enough clues and connecting the evidence board.\n\nDistrict prosecutors rejected your filing due to lack of proof. Re-examine the locations and solve the cipher barriers to build an airtight case.`
    }
  }
};
