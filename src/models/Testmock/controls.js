const userdts = {
  userDetails: {
    email: 'Veeramanikandan.J@mrcooper.com',
    jobTitle: 'Lead Engineer',
    name: 'Veeramanikandan J',
  },
  userGroups: [
    {
      '@odata.type': '#microsoft.graph.group',
      id: 'c44605f0-8863-4ce9-92b0-67df3f315d7e',
      description: 'This group will be used as Dev access security group for Backend Underwriter role for CMOD application',
      displayName: 'cmod-dev-beuw-mgr',
      securityEnabled: true,
      groupName: 'beuw-mgr',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '859eb4d0-465f-4ed8-b484-c5a98afcd4db',
      description: 'This group will be used as Dev access security group for Backend Underwriter role for CMOD application',
      displayName: 'cmod-dev-beuw',
      securityEnabled: true,
      groupName: 'beuw',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '58eb74f2-02a4-4307-b7f9-c07f725856e5',
      description: 'This group will be used as Dev access security group for Stager role for CMOD application',
      displayName: 'cmod-dev-stager-mgr',
      securityEnabled: true,
      groupName: 'stager-mgr',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '580fe299-78e3-4585-8962-dec6138c30f8',
      description: 'The groups will be used as security groups for the CMOD Application',
      displayName: 'cmod-dev-feuw',
      securityEnabled: true,
      groupName: 'feuw',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '778a39e6-7755-43cc-aac8-48762fdbadee',
      description: 'This group will be used as Dev access security group for Stager role for CMOD application',
      displayName: 'cmod-dev-stager',
      securityEnabled: true,
      groupName: 'stager',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: 'aa6f1878-3f52-49dd-9d9f-300257649ed2',
      description: 'these groups are used by CMOD application FrontEnd underwriter manager role access',
      displayName: 'cmod-dev-feuw-mgr',
      securityEnabled: true,
      groupName: 'feuw-mgr',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: 'd859607a-b052-443a-a8aa-696a8d4b818d',
      description: 'CMOD group used by BETA team',
      displayName: 'cmod-dev-beta',
      securityEnabled: true,
      groupName: 'beta',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '55c6385a-fc43-4a6b-bdbf-64ce4bac44d2',
      description: 'CMOD group used by Processing team',
      displayName: 'cmod-dev-proc',
      securityEnabled: true,
      groupName: 'proc',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '1d9e937b-b9e9-4982-a00f-e141efa09e13',
      description: 'CMOD group used by Processing team',
      displayName: 'cmod-dev-proc-mgr',
      securityEnabled: true,
      groupName: 'proc-mgr',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '146b01f5-7167-49b1-8826-064d975153ed',
      description: 'CMOD group used by DocGen team',
      displayName: 'cmod-dev-docgen',
      securityEnabled: true,
      groupName: 'docgen',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '73a21d91-e9bf-425b-8ae7-f5e57b3f36b3',
      description: 'CMOD group used by DocGen team',
      displayName: 'cmod-dev-docgen-mgr',
      securityEnabled: true,
      groupName: 'docgen-mgr',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: 'f2c016b5-ebd9-443a-a555-ce6b886535ec',
      description: 'CMOD group used by DocGen team',
      displayName: 'cmod-dev-docsin',
      securityEnabled: true,
      groupName: 'docsin',
    },
    {
      '@odata.type': '#microsoft.graph.group',
      id: '18fd04ae-219f-4ebe-98a6-df495c68b82e',
      description: 'CMOD group used by DocGen team',
      displayName: 'cmod-dev-docsin-mgr',
      securityEnabled: true,
      groupName: 'docsin-mgr',
    },
  ],
  groupList: [
    'beuw-mgr',
    'beuw',
    'stager-mgr',
    'feuw',
    'stager',
    'feuw-mgr',
    'beta',
    'proc',
    'proc-mgr',
    'docgen',
    'docgen-mgr',
    'docsin',
    'docsin-mgr',
  ],
  skills: {
    FEUW: [
      'Skill36::Z DEALS ONSHORE::true::false',
      'Skill12::FHA USAA ONSHORE::true::false',
      'Skill38::ABS MRC ONSHORE::true::false',
      'Skill26::HAWAIIAN MRC ONSHORE::true::false',
      'Skill10::FHA MRC ONSHORE::true::false',
      'Skill40::ABS USAA ONSHORE::true::false',
      'Skill18::VA MRC ONSHORE::true::false',
      'Skill33::T DEALS OFFSHORE::true::false',
      'Skill19::VA USAA OFFSHORE::true::false',
      'Skill29::HE OR HELOC MRC OFFSHORE::true::false',
      'Skill2::FNMA MRC ONSHORE::true::false',
      'Skill52::GOV USAA ONSHORE::true::false',
      'Skill3::FNMA USAA OFFSHORE::true::false',
      'Skill41::Special MRC OFFSHORE::true::false',
      'Skill44::Special USAA ONSHORE::true::false',
      'Skill9::FHA MRC OFFSHORE::true::false',
      'Skill14::USDA MRC ONSHORE::true::false',
      'Skill5::Freddie MRC OFFSHORE::true::false',
      'Skill13::USDA MRC OFFSHORE::true::false',
      'Skill28::HAWAIIAN USAA ONSHORE::true::false',
      'Skill43::Special USAA OFFSHORE::true::false',
      'Skill16::USDA USAA ONSHORE::true::false',
      'Skill42::Special MRC ONSHORE::true::false',
      'Skill23::VETERANS LB USAA OFFSHORE::true::false',
      'Skill22::VETERANS LB MRC ONSHORE::true::false',
      'Skill8::Freddie USAA ONSHORE::true::false',
      'Skill37::ABS MRC OFFSHORE::true::false',
      'Skill49::GOV MRC OFFSHORE::true::false',
      'Skill21::VETERANS LB MRC OFFSHORE::true::false',
      'Skill17::VA MRC OFFSHORE::true::false',
      'Skill1::FNMA MRC OFFSHORE::true::false',
      'Skill27::HAWAIIAN USAA OFFSHORE::true::false',
      'Skill31::HE OR HELOC USAA OFFSHORE::true::false',
      'Skill15::USDA USAA OFFSHORE::true::false',
      'Skill11::FHA USAA OFFSHORE::true::false',
      'Skill39::ABS USAA OFFSHORE::true::false',
      'Skill46::TVLB MRC OFFSHORE::true::false',
      'Skill34::T DEALS ONSHORE::true::false',
      'Skill7::Freddie USAA OFFSHORE::true::false',
      'Skill48::TVLB USAA OFFSHORE::true::false',
      'Skill35::Z DEALS OFFSHORE::true::false',
      'Skill25::HAWAIIAN MRC OFFSHORE::true::false',
      'Skill32::HE OR HELOC USAA ONSHORE::true::false',
      'Skill51::GOV USAA OFFSHORE::true::false',
      'Skill20::VA USAA ONSHORE::true::false',
      'Skill50::GOV MRC ONSHORE::true::false',
      'Skill45::TVLB MRC ONSHORE::true::false',
      'Skill47::TVLB USAA ONSHORE::true::false',
      'Skill6::Freddie MRC ONSHORE::true::false',
      'Skill4::FNMA USAA ONSHORE::true::false',
      'Skill24::VETERANS LB USAA ONSHORE::true::false',
      'Skill30::HE OR HELOC MRC ONSHORE::true::false',
    ],
    DOCSIN: [
      'Skill6::FNMA MANAGER REVIEW REQUIRED::true::false',
      'Skill50::Z DEALS BOOKING PREP ONSHORE ONLY::true::false',
      'Skill32::NON GSE BOOKING PREP SEND ONSHORE::true::false',
      'Skill53::Z DEALS BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill7::FNMA MANAGER UNREJECT REVIEW::true::false',
      'Skill87::ONSHORE NAME CHANGE REQUIRED::true::false',
      'Skill22::SPECIAL MANAGER REVIEW REQUIRED::true::false',
      'Skill69::FL SAFE ACT REQUIRED::true::false',
      'Skill71::IL SAFE ACT REQUIRED::true::false',
      'Skill81::TN SAFE ACT REQUIRED::true::false',
      'Skill15::FREDDIE MANAGER UNREJECT REVIEW::true::false',
      'Skill4::FNMA OFFSHORE TL REVIEW::true::false',
      'Skill80::SD SAFE ACT REQUIRED::true::false',
      'Skill31::NON GSE MANAGER UNREJECT REVIEW::true::false',
      'Skill33::T DEALS ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill62::GOV MANAGER REVIEW REQUIRED::true::false',
      'Skill76::NM SAFE ACT REQUIRED::true::false',
      'Skill59::GOV OFFSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill84::VT SAFE ACT REQUIRED::true::false',
      'Skill63::GOV MANAGER UNREJECT REVIEW::true::false',
      'Skill14::FREDDIE MANAGER REVIEW REQUIRED::true::false',
      'Skill72::KY SAFE ACT REQUIRED::true::false',
      'Skill46::TVLB MANAGER REVIEW REQUIRED::true::false',
      'Skill70::GA SAFE ACT REQUIRED::true::false',
      'Skill75::NE SAFE ACT REQUIRED::true::false',
      'Skill79::SC SAFE ACT REQUIRED::true::false',
      'Skill66::AL SAFE ACT REQUIRED::true::false',
      'Skill13::FREDDIE BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill41::TVLB ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill56::Z DEALS BOOKING PREP SEND ONSHORE::true::false',
      'Skill38::T DEALS MANAGER REVIEW REQUIRED::true::false',
      'Skill74::MN SAFE ACT REQUIRED::true::false',
      'Skill11::FREDDIE OFFSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill54::Z DEALS MANAGER REVIEW REQUIRED::true::false',
      'Skill83::VA SAFE ACT REQUIRED::true::false',
      'Skill85::WV SAFE ACT REQUIRED::true::false',
      'Skill20::SPECIAL OFFSHORE TL REVIEW::true::false',
      'Skill42::TVLB BOOKING PREP ONSHORE ONLY::true::false',
      'Skill3::FNMA OFFSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill5::FNMA BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill21::SPECIAL BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill24::SPECIAL BOOKING PREP SEND ONSHORE::true::false',
      'Skill1::FNMA ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill8::FNMA BOOKING PREP SEND ONSHORE::true::false',
      'Skill57::GOV ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill18::SPECIAL BOOKING PREP ONSHORE ONLY::true::false',
      'Skill19::SPECIAL OFFSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill67::AR SAFE ACT REQUIRED::true::false',
      'Skill47::TVLB MANAGER UNREJECT REVIEW::true::false',
      'Skill78::OK SAFE ACT REQUIRED::true::false',
      'Skill45::TVLB BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill25::NON GSE ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill34::T DEALS BOOKING PREP ONSHORE ONLY::true::false',
      'Skill64::GOV BOOKING PREP SEND ONSHORE::true::false',
      'Skill68::DC SAFE ACT REQUIRED::true::false',
      'Skill88::SEND TO DOC INTAKE::true::false',
      'Skill9::FREDDIE ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill28::NON GSE OFFSHORE TL REVIEW::true::false',
      'Skill2::FNMA BOOKING PREP ONSHORE ONLY::true::false',
      'Skill23::SPECIAL MANAGER UNREJECT REVIEW::true::false',
      'Skill77::OH SAFE ACT REQUIRED::true::false',
      'Skill43::TVLB OFFSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill60::GOV OFFSHORE TL REVIEW::true::false',
      'Skill65::AK SAFE ACT REQUIRED::true::false',
      'Skill16::FREDDIE BOOKING PREP SEND ONSHORE::true::false',
      'Skill10::FREDDIE BOOKING PREP ONSHORE ONLY::true::false',
      'Skill86::WY SAFE ACT REQUIRED::true::false',
      'Skill89::DOC INTAKE::true::false',
      'Skill58::GOV BOOKING PREP ONSHORE ONLY::true::false',
      'Skill26::NON GSE BOOKING PREP ONSHORE ONLY::true::false',
      'Skill82::TX SAFE ACT REQUIRED::true::false',
      'Skill17::SPECIAL ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill61::GOV BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill35::T DEALS OFFSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill73::LA SAFE ACT REQUIRED::true::false',
      'Skill12::FREDDIE OFFSHORE TL REVIEW::true::false',
      'Skill52::Z DEALS OFFSHORE TL REVIEW::true::false',
      'Skill44::TVLB OFFSHORE TL REVIEW::true::false',
      'Skill40::T DEALS BOOKING PREP SEND ONSHORE::true::false',
      'Skill29::NON GSE BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill51::Z DEALS OFFSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill48::TVLB BOOKING PREP SEND ONSHORE::true::false',
      'Skill36::T DEALS OFFSHORE TL REVIEW::true::false',
      'Skill30::NON GSE MANAGER REVIEW REQUIRED::true::false',
      'Skill39::T DEALS MANAGER UNREJECT REVIEW::true::false',
      'Skill55::Z DEALS MANAGER UNREJECT REVIEW::true::false',
      'Skill37::T DEALS BOOKING PREP OFFSHORE REVIEW::true::false',
      'Skill49::Z DEALS ONSHORE SAFEACT NOT REQUIRED::true::false',
      'Skill27::NON GSE OFFSHORE SAFEACT NOT REQUIRED::true::false',
    ],
    PROC: [
      'Skill50::Z DEAL SEND ONSHORE::false::false',
      'Skill3::USAA ONSHORE::false::false',
      'Skill51::LITIGATION::false::false',
      'Skill45::TVLB SEND ONSHORE::false::false',
      'Skill20::SPECIAL SEND ONSHORE::false::false',
      'Skill47::Z DEAL TL OFFSHORE::false::false',
      'Skill39::VA MANAGER::false::false',
      'Skill33::USDA ONSHORE::false::false',
      'Skill44::TVLB MANAGER::false::false',
      'Skill43::TVLB ONSHORE::false::false',
      'Skill40::VA SEND ONSHORE::false::false',
      'Skill13::FREDDIE ONSHORE::false::false',
      'Skill37::VA TL OFFSHORE::false::false',
      'Skill30::FHA SEND ONSHORE::false::false',
      'Skill11::FREDDIE TL OFFSHORE::false::false',
      'Skill49::Z DEAL MANAGER::false::false',
      'Skill36::VA OFFSHORE::false::false',
      'Skill8::FNMA ONSHORE::false::false',
      'Skill1::USAA OFFSHORE::false::false',
      'Skill38::VA ONSHORE::false::false',
      'Skill27::FHA TL OFFSHORE::false::false',
      'Skill2::USAA OFFSHORE TL::false::false',
      'Skill10::FNMA SEND ONSHORE::false::false',
      'Skill46::Z DEAL OFFSHORE::false::false',
      'Skill12::FREDDIE OFFSHORE::false::false',
      'Skill15::FREDDIE SEND ONSHORE::false::false',
      'Skill5::USAA MANAGER REVIEW::false::false',
      'Skill18::SPECIAL ONSHORE::false::false',
      'Skill35::USDA SEND ONSHORE::false::false',
      'Skill14::FREDDIE MANAGER ONSHORE::false::false',
      'Skill32::USDA TL OFFSHORE::false::false',
      'Skill28::FHA ONSHORE::false::false',
      'Skill41::TVLB OFFSHORE::false::false',
      'Skill19::SPECIAL MANAGER ONSHORE::false::false',
      'Skill22::PLS OFFSHORE::false::false',
      'Skill25::PLS SEND ONSHORE::false::false',
      'Skill21::PLS TL OFFSHORE::false::false',
      'Skill29::FHA MANAGER::false::false',
      'Skill42::TVLB TL OFFSHORE::false::false',
      'Skill52::LITIGATION MANAGER REVIEW::false::false',
      'Skill6::FNMA OFFSHORE::false::false',
      'Skill31::USDA OFFSHORE::false::false',
      'Skill7::FNMA TL OFFSHORE::false::false',
      'Skill34::USDA MANAGER::false::false',
      'Skill17::SPECIAL OFFSHORE::false::false',
      'Skill26::FHA OFFSHORE::false::false',
      'Skill9::FNMA MANAGER ONSHORE::false::false',
      'Skill16::SPECIAL TL OFFSHORE::false::false',
      'Skill23::PLS ONSHORE::false::false',
      'Skill24::PLS MANAGER::false::false',
      'Skill4::USAA SEND ONSHORE::false::false',
      'Skill48::Z DEAL ONSHORE::false::false',
    ],
    POSTMOD: [
      'Skill3::SEND MOD AGREEMENT ONSHORE::true::false',
      'Skill6::INVESTOR SETTLEMENT ONSHORE::true::false',
      'Skill7::INCENTIVE ONSHORE::true::false',
      'Skill1::FNMA QC ONSHORE::true::false',
      'Skill4::RECORDATION TO ORDER ONSHORE::true::false',
      'Skill5::RECORDATION ORDERED ONSHORE::true::false',
      'Skill2::COUNTERSIGN ONSHORE::true::false',
    ],
    DOCGEN: [
      'Skill31::PLS TL OFFSHORE::true::false',
      'Skill37::PLS ONSHORE INFLIGHT::true::false',
      'Skill26::SPECIAL MANAGER LOCK ONSHORE::true::false',
      'Skill30::PLS ONSHORE::true::false',
      'Skill79::T2P ONSHORE AVP REVIEW::true::false',
      'Skill64::FHA TL ONSHORE::true::false',
      'Skill45::VA QC::true::false',
      'Skill34::PLS MANAGER LOCK ONSHORE::true::false',
      'Skill22::SPECIAL ONSHORE::true::false',
      'Skill48::GOV T2P ONSHORE MANAGER REVIEW::true::false',
      'Skill25::SPECIAL T2P ONSHORE MANAGER REVIEW::true::false',
      'Skill74::GOVY MANAGER ONSHORE::true::false',
      'Skill47::TVLB MANAGER ONSHORE::true::false',
      'Skill18::FREDDIE QC::true::false',
      'Skill78::FHA ONSHORE INFLIGHT::true::false',
      'Skill66::USDA ONSHORE::true::false',
      'Skill86::STATE REVIEW ONSHORE::true::false',
      'Skill69::USDA SEND ONSHORE::true::false',
      'Skill65::FHA QC::true::false',
      'Skill44::VA ONSHORE INFLIGHT::true::false',
      'Skill1::FNMA ONSHORE::true::false',
      'Skill71::USDA ONSHORE INFLIGHT::true::false',
      'Skill32::PLS OFFSHORE::true::false',
      'Skill43::VA TL ONSHORE::true::false',
      'Skill40::VA ONSHORE::true::false',
      'Skill75::GOV T2P ONSHORE MANAGER REVIEW::true::false',
      'Skill54::Z DEALS ONSHORE::true::false',
      'Skill3::FNMA OFFSHORE::true::false',
      'Skill16::FREDDIE TL ONSHORE::true::false',
      'Skill50::TVLB ONSHORE INFLIGHT::true::false',
      'Skill62::FHA OFFSHORE::true::false',
      'Skill85::LITIGATION MANAGER ONSHORE::true::false',
      'Skill4::FNMA MANAGER LOCK ONSHORE::true::false',
      'Skill49::TVLB ONSHORE::true::false',
      'Skill2::FNMA TL OFFSHORE::true::false',
      'Skill27::SPECIAL MANAGER ONSHORE::true::false',
      'Skill83::LITIGATION MANAGER ONSHORE::true::false',
      'Skill14::FREDDIE MANAGER LOCK ONSHORE::true::false',
      'Skill81::T2P ONSHORE VP REVIEW::true::false',
      'Skill42::VA OFFSHORE::true::false',
      'Skill36::PLS TL ONSHORE::true::false',
      'Skill57::VETERANS LAND BOARD ONSHORE::true::false',
      'Skill12::FREDDIE TL OFFSHORE::true::false',
      'Skill11::FREDDIE ONSHORE::true::false',
      'Skill7::FNMA NONDELEGATED ONSHORE::true::false',
      'Skill82::LITIGATION HANDLING ONSHORE::true::false',
      'Skill63::FHA SEND ONSHORE::true::false',
      'Skill17::FREDDIE ONSHORE INFLIGHT::true::false',
      'Skill80::T2P INITIAL REVIEW REQUIRED::true::false',
      'Skill52::Z DEALS MANAGER LOCK ONSHORE::true::false',
      'Skill46::TVLB MANAGER LOCK ONSHORE::true::false',
      'Skill67::USDA TL OFFSHORE::true::false',
      'Skill68::USDA OFFSHORE::true::false',
      'Skill76::NAH & DEP OF HAWAIIAN ONSHORE::true::false',
      'Skill23::SPECIAL OFFSHORE TL REVIEW::true::false',
      'Skill38::PLS QC::true::false',
      'Skill33::USAA PLS ONSHORE::true::false',
      'Skill41::VA TL OFFSHORE::true::false',
      'Skill21::SPECIAL PRINCIPAL ONSHORE::true::false',
      'Skill9::FNMA QC::true::false',
      'Skill84::LITIGATION HANDLING ONSHORE::true::false',
      'Skill72::USDA QC::true::false',
      'Skill8::FNMA ONSHORE INFLIGHT::true::false',
      'Skill55::Z DEALS ONSHORE INFLIGHT::true::false',
      'Skill19::FREDDIE T2P ONSHORE MANAGER REVIEW::true::false',
      'Skill51::TVLB QC::true::false',
      'Skill13::FREDDIE OFFSHORE::true::false',
      'Skill29::SPECIAL QC::true::false',
      'Skill15::FREDDIE MANAGER ONSHORE::true::false',
      'Skill10::FNMA T2P ONSHORE MANAGER REVIEW::true::false',
      'Skill20::SPECIAL FT ONSHORE::true::false',
      'Skill24::SPECIAL OFFSHORE REVIEW::true::false',
      'Skill53::Z DEALS MANAGER ONSHORE::true::false',
      'Skill87::STATE REVIEW MANAGER ONSHORE::true::false',
      'Skill6::FNMA TL ONSHORE::true::false',
      'Skill77::NAH & DEP OF HAWAIIAN QC::true::false',
      'Skill73::GOVY MANAGER LOCK ONSHORE::true::false',
      'Skill5::FNMA MANAGER ONSHORE::true::false',
      'Skill35::PLS MANAGER ONSHORE::true::false',
      'Skill61::FHA TL OFFSHORE::true::false',
      'Skill28::SPECIAL ONSHORE INFLIGHT::true::false',
      'Skill39::PLS T2P ONSHORE MANAGER REVIEW::true::false',
      'Skill60::FHA ONSHORE::true::false',
      'Skill56::Z DEALS QC::true::false',
      'Skill70::USDA TL ONSHORE::true::false',
      'Skill58::VETERANS LAND BOARD ONSHORE INFLIGHT::true::false',
      'Skill59::FREDDIE T2P ONSHORE MANAGER REVIEW::true::false',
    ],
    BEUW: [
      'Skill6::TVLB ONSHORE::true::false',
      'Skill48::PLS OFFSHORE::true::false',
      'Skill11::Z DEALS MANAGER ONSHORE::true::false',
      'Skill74::FREDDIE SL OFFSHORE REVIEW::true::false',
      'Skill82::SPECIAL SL SEND TO ONSHORE REVIEW::true::false',
      'Skill72::FNMA SL ONSHORE TL REVIEW::true::false',
      'Skill23::FNMA NO INCOME OFFSHORE::true::false',
      'Skill12::SPECIAL PRINCIPAL ONSHORE::true::false',
      'Skill68::FNMA SL OFFSHORE REVIEW::true::false',
      'Skill7::TVLB MANAGER ONSHORE::true::false',
      'Skill45::VA SEND ONSHORE::true::false',
      'Skill41::USDA TL ONSHORE::true::false',
      'Skill79::SPECIAL SL OFFSHORE REVIEW::true::false',
      'Skill44::VA ONSHORE::true::false',
      'Skill37::USDA OFFSHORE::true::false',
      'Skill69::FNMA SL OFFSHORE TL REVIEW::true::false',
      'Skill55::SPECIAL QC::true::false',
      'Skill21::FREDDIE MANAGER ONSHORE::true::false',
      'Skill43::VA TL OFFSHORE::true::false',
      'Skill9::T DEALS MANAGER ONSHORE::true::false',
      'Skill77::FREDDIE SL SEND TO ONSHORE REVIEW::true::false',
      'Skill34::FHA TL ONSHORE::true::false',
      'Skill33::FHA SEND ONSHORE::true::false',
      'Skill67::FNMA WITH INCOME ONSHORE::true::false',
      'Skill5::STATE EVAL MANAGER ONSHORE::true::false',
      'Skill22::MANAGER LOCK ONSHORE::true::false',
      'Skill73::SL MANAGER REVIEW::true::false',
      'Skill28::FNMA TL ONSHORE::true::false',
      'Skill27::FNMA SEND ONSHORE::true::false',
      'Skill70::FNMA SL ONSHORE REVIEW::true::false',
      'Skill78::FREDDIE SL ONSHORE TL REVIEW::true::false',
      'Skill84::NON GSE SL OFFSHORE REVIEW::true::false',
      'Skill53::USAA PLS ONSHORE::true::false',
      'Skill18::FREDDIE ONSHORE::true::false',
      'Skill29::FNMA MANAGER ONSHORE::true::false',
      'Skill35::GOVY MANAGER ONSHORE::true::false',
      'Skill47::VETERANS LAND BOARD ONSHORE::true::false',
      'Skill51::PLS SEND ONSHORE::true::false',
      'Skill17::FREDDIE TL OFFSHORE::true::false',
      'Skill16::FREDDIE OFFSHORE::true::false',
      'Skill19::FREDDIE SEND ONSHORE::true::false',
      'Skill87::NON GSE SEND TO SL ONSHORE REVIEW::true::false',
      'Skill50::PLS ONSHORE::true::false',
      'Skill32::FHA ONSHORE::true::false',
      'Skill75::FREDDIE SL OFFSHORE TL REVIEW::true::false',
      'Skill31::FHA TL OFFSHORE::true::false',
      'Skill3::STATE EVAL ONSHORE::true::false',
      'Skill54::PLS MANAGER ONSHORE::true::false',
      'Skill30::FHA OFFSHORE::true::false',
      'Skill46::VA TL ONSHORE::true::false',
      'Skill57::FREDDIE QC::true::false',
      'Skill85::NON GSE SL OFFSHORE TL REVIEW::true::false',
      'Skill10::Z DEALS ONSHORE::true::false',
      'Skill40::USDA SEND ONSHORE::true::false',
      'Skill59::TVLB QC::true::false',
      'Skill80::SPECIAL SL OFFSHORE TL REVIEW::true::false',
      'Skill39::USDA ONSHORE::true::false',
      'Skill64::USDA QC::true::false',
      'Skill2::LITIGATION MANAGER ONSHORE::true::false',
      'Skill4::SPECIAL STATE EVAL ONSHORE::true::false',
      'Skill71::FNMA SL SEND TO ONSHORE REVIEW::true::false',
      'Skill63::NAH & DEP OF HAWAIIAN QC::true::false',
      'Skill24::FNMA TL OFFSHORE::true::false',
      'Skill62::FHA QC::true::false',
      'Skill81::SPECIAL SL ONSHORE REVIEW::true::false',
      'Skill26::FNMA NONDELEGATED ONSHORE::true::false',
      'Skill76::FREDDIE SL ONSHORE REVIEW::true::false',
      'Skill38::USDA TL OFFSHORE::true::false',
      'Skill89::USAA ONSHORE REVIEW::true::false',
      'Skill52::PLS TL ONSHORE::true::false',
      'Skill58::PLS QC::true::false',
      'Skill14::SPECIAL ONSHORE::true::false',
      'Skill83::SPECIAL SL ONSHORE TL REVIEW::true::false',
      'Skill88::NON GSE SL ONSHORE TL REVIEW::true::false',
      'Skill8::T DEALS ONSHORE::true::false',
      'Skill66::FNMA WITH INCOME OFFSHORE::true::false',
      'Skill61::Z DEALS QC::true::false',
      'Skill36::NAH & DEP OF HAWAIIAN ONSHORE::true::false',
      'Skill42::VA OFFSHORE::true::false',
      'Skill56::FNMA QC::true::false',
      'Skill15::SPECIAL MANAGER ONSHORE::true::false',
      'Skill65::VA QC::true::false',
      'Skill20::FREDDIE TL ONSHORE::true::false',
      'Skill13::SPECIAL FT ONSHORE::true::false',
      'Skill90::SL STATE REVIEW ONSHORE::true::false',
      'Skill60::T DEALS QC::true::false',
      'Skill86::NON GSE SL ONSHORE REVIEW::true::false',
      'Skill1::LITIGATION HANDLING ONSHORE::true::false',
      'Skill49::PLS TL OFFSHORE::true::false',
      'Skill25::FNMA NO INCOME ONSHORE::true::false',
    ],
    BOOKING: [
      'Skill1::SPECIAL LOANS BOOKING::true::false',
    ],
  },
};
module.exports = userdts;