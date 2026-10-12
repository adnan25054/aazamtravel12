export interface IndianStation {
  StationCode: string;
  NameEn: string;
  NameHn?: string;
  State: string;
  Zone?: string;
  City?: string;
}

export const INDIAN_STATIONS: IndianStation[] = [
  // ==========================================
  // Delhi NCR & Northern Railway
  // ==========================================
  { StationCode: 'NDLS', NameEn: 'New Delhi', NameHn: 'नई दिल्ली', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'DLI', NameEn: 'Old Delhi Jn', NameHn: 'पुरानी दिल्ली', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'NZM', NameEn: 'Hazrat Nizamuddin', NameHn: 'हज़रत निज़ामुद्दीन', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'ANVT', NameEn: 'Anand Vihar Terminal', NameHn: 'आनंद विहार टर्मिनल', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'DEE', NameEn: 'Delhi Sarai Rohilla', NameHn: 'सराय रोहिल्ला', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'DEC', NameEn: 'Delhi Cantt', NameHn: 'दिल्ली कैंट', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'DSA', NameEn: 'Delhi Shahdara Jn', NameHn: 'दिल्ली शाहदरा', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'SZM', NameEn: 'Sabzi Mandi', NameHn: 'सब्जी मंडी', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'OKA', NameEn: 'Okhla', NameHn: 'ओखला', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'TKD', NameEn: 'Tuglakabad', NameHn: 'तुगलकाबाद', State: 'Delhi', City: 'Delhi', Zone: 'NR' },
  { StationCode: 'GZB', NameEn: 'Ghaziabad Jn', NameHn: 'गाज़ियाबाद', State: 'Uttar Pradesh', City: 'Ghaziabad', Zone: 'NR' },
  { StationCode: 'GGN', NameEn: 'Gurgaon', NameHn: 'गुड़गांव (गुरुग्राम)', State: 'Haryana', City: 'Gurugram', Zone: 'NR' },
  { StationCode: 'FDB', NameEn: 'Faridabad', NameHn: 'फरीदाबाद', State: 'Haryana', City: 'Faridabad', Zone: 'NR' },

  // ==========================================
  // Maharashtra & Western / Central Railway
  // ==========================================
  { StationCode: 'CSMT', NameEn: 'Mumbai CSMT', NameHn: 'मुंबई छत्रपति शिवाजी', State: 'Maharashtra', City: 'Mumbai', Zone: 'CR' },
  { StationCode: 'MMCT', NameEn: 'Mumbai Central', NameHn: 'मुंबई सेंट्रल', State: 'Maharashtra', City: 'Mumbai', Zone: 'WR' },
  { StationCode: 'BDTS', NameEn: 'Bandra Terminus', NameHn: 'बांद्रा टर्मिनस', State: 'Maharashtra', City: 'Mumbai', Zone: 'WR' },
  { StationCode: 'LTT', NameEn: 'Lokmanya Tilak Terminus (Kurla)', NameHn: 'लोकमान्य तिलक टर्मिनस', State: 'Maharashtra', City: 'Mumbai', Zone: 'CR' },
  { StationCode: 'DR', NameEn: 'Dadar Central', NameHn: 'दादर सेंट्रल', State: 'Maharashtra', City: 'Mumbai', Zone: 'CR' },
  { StationCode: 'DDR', NameEn: 'Dadar Western', NameHn: 'दादर वेस्टर्न', State: 'Maharashtra', City: 'Mumbai', Zone: 'WR' },
  { StationCode: 'TNA', NameEn: 'Thane', NameHn: 'ठाणे', State: 'Maharashtra', City: 'Thane', Zone: 'CR' },
  { StationCode: 'KYN', NameEn: 'Kalyan Jn', NameHn: 'कल्याण जं.', State: 'Maharashtra', City: 'Kalyan', Zone: 'CR' },
  { StationCode: 'PNVL', NameEn: 'Panvel Jn', NameHn: 'पनवेल', State: 'Maharashtra', City: 'Panvel', Zone: 'CR' },
  { StationCode: 'BVI', NameEn: 'Borivali', NameHn: 'बोरिवली', State: 'Maharashtra', City: 'Mumbai', Zone: 'WR' },
  { StationCode: 'BSR', NameEn: 'Vasai Road', NameHn: 'वसई रोड', State: 'Maharashtra', City: 'Vasai', Zone: 'WR' },
  { StationCode: 'PUNE', NameEn: 'Pune Jn', NameHn: 'पुणे जं.', State: 'Maharashtra', City: 'Pune', Zone: 'CR' },
  { StationCode: 'SVJR', NameEn: 'Shivajinagar (Pune)', NameHn: 'शिवाजीनगर', State: 'Maharashtra', City: 'Pune', Zone: 'CR' },
  { StationCode: 'CCH', NameEn: 'Chinchwad', NameHn: 'चिंचवड़', State: 'Maharashtra', City: 'Pune', Zone: 'CR' },
  { StationCode: 'LNL', NameEn: 'Lonavala', NameHn: 'लोनावला', State: 'Maharashtra', City: 'Lonavala', Zone: 'CR' },
  { StationCode: 'NGP', NameEn: 'Nagpur Jn', NameHn: 'नागपुर जं.', State: 'Maharashtra', City: 'Nagpur', Zone: 'CR' },
  { StationCode: 'AJNI', NameEn: 'Ajni (Nagpur)', NameHn: 'अजनी', State: 'Maharashtra', City: 'Nagpur', Zone: 'CR' },
  { StationCode: 'BSL', NameEn: 'Bhusaval Jn', NameHn: 'भुसावल जं.', State: 'Maharashtra', City: 'Bhusaval', Zone: 'CR' },
  { StationCode: 'NK', NameEn: 'Nashik Road', NameHn: 'नाशिक रोड', State: 'Maharashtra', City: 'Nashik', Zone: 'CR' },
  { StationCode: 'MMR', NameEn: 'Manmad Jn', NameHn: 'मनमाड जं.', State: 'Maharashtra', City: 'Manmad', Zone: 'CR' },
  { StationCode: 'JL', NameEn: 'Jalgaon Jn', NameHn: 'जलगांव जं.', State: 'Maharashtra', City: 'Jalgaon', Zone: 'CR' },
  { StationCode: 'AK', NameEn: 'Akola Jn', NameHn: 'अकोला जं.', State: 'Maharashtra', City: 'Akola', Zone: 'CR' },
  { StationCode: 'BD', NameEn: 'Badnera Jn (Amravati)', NameHn: 'बडनेरा जं.', State: 'Maharashtra', City: 'Amravati', Zone: 'CR' },
  { StationCode: 'AMI', NameEn: 'Amravati', NameHn: 'अमरावती', State: 'Maharashtra', City: 'Amravati', Zone: 'CR' },
  { StationCode: 'WR', NameEn: 'Wardha Jn', NameHn: 'वर्धा जं.', State: 'Maharashtra', City: 'Wardha', Zone: 'CR' },
  { StationCode: 'CD', NameEn: 'Chandrapur', NameHn: 'चंद्रपुर', State: 'Maharashtra', City: 'Chandrapur', Zone: 'CR' },
  { StationCode: 'BPQ', NameEn: 'Balharshah Jn', NameHn: 'बल्हारशाह जं.', State: 'Maharashtra', City: 'Ballarpur', Zone: 'CR' },
  { StationCode: 'G', NameEn: 'Gondia Jn', NameHn: 'गोंदिया जं.', State: 'Maharashtra', City: 'Gondia', Zone: 'SECR' },
  { StationCode: 'SUR', NameEn: 'Solapur Jn', NameHn: 'सोलापुर जं.', State: 'Maharashtra', City: 'Solapur', Zone: 'CR' },
  { StationCode: 'KWV', NameEn: 'Kurduvadi Jn', NameHn: 'कुर्डूवाडी जं.', State: 'Maharashtra', City: 'Kurduvadi', Zone: 'CR' },
  { StationCode: 'KOP', NameEn: 'Kolhapur CSMT', NameHn: 'कोल्हापुर', State: 'Maharashtra', City: 'Kolhapur', Zone: 'CR' },
  { StationCode: 'MRJ', NameEn: 'Miraj Jn', NameHn: 'मिरज जं.', State: 'Maharashtra', City: 'Miraj', Zone: 'CR' },
  { StationCode: 'SLI', NameEn: 'Sangli', NameHn: 'सांगली', State: 'Maharashtra', City: 'Sangli', Zone: 'CR' },
  { StationCode: 'STR', NameEn: 'Satara', NameHn: 'सातारा', State: 'Maharashtra', City: 'Satara', Zone: 'CR' },
  { StationCode: 'DAUND', NameEn: 'Daund Jn', NameHn: 'दौंड जं.', State: 'Maharashtra', City: 'Daund', Zone: 'CR' },
  { StationCode: 'SNSI', NameEn: 'Sainagar Shirdi', NameHn: 'साईंनगर शिर्डी', State: 'Maharashtra', City: 'Shirdi', Zone: 'CR' },
  { StationCode: 'KPG', NameEn: 'Kopargaon (Shirdi)', NameHn: 'कोपरगांव', State: 'Maharashtra', City: 'Kopargaon', Zone: 'CR' },
  { StationCode: 'ANG', NameEn: 'Ahmednagar', NameHn: 'अहमदनगर', State: 'Maharashtra', City: 'Ahmednagar', Zone: 'CR' },
  { StationCode: 'SEG', NameEn: 'Shegaon', NameHn: 'शेगांव', State: 'Maharashtra', City: 'Shegaon', Zone: 'CR' },
  { StationCode: 'RN', NameEn: 'Ratnagiri', NameHn: 'रत्नागिरी', State: 'Maharashtra', City: 'Ratnagiri', Zone: 'KR' },
  { StationCode: 'CSN', NameEn: 'Chalisgaon Jn', NameHn: 'चालीसगांव जं.', State: 'Maharashtra', City: 'Chalisgaon', Zone: 'CR' },
  { StationCode: 'IGP', NameEn: 'Igatpuri', NameHn: 'इगतपुरी', State: 'Maharashtra', City: 'Igatpuri', Zone: 'CR' },
  { StationCode: 'AWB', NameEn: 'Chhatrapati Sambhajinagar (Aurangabad)', NameHn: 'छत्रपति संभाजीनगर (औरंगाबाद)', State: 'Maharashtra', City: 'Aurangabad', Zone: 'SCR' },
  { StationCode: 'J', NameEn: 'Jalna', NameHn: 'जालना', State: 'Maharashtra', City: 'Jalna', Zone: 'SCR' },
  { StationCode: 'NED', NameEn: 'Hazur Sahib Nanded', NameHn: 'हजूर साहिब नांदेड़', State: 'Maharashtra', City: 'Nanded', Zone: 'SCR' },
  { StationCode: 'PAU', NameEn: 'Purna Jn', NameHn: 'पूर्णा जं.', State: 'Maharashtra', City: 'Purna', Zone: 'SCR' },
  { StationCode: 'PBN', NameEn: 'Parbhani Jn', NameHn: 'परभणी जं.', State: 'Maharashtra', City: 'Parbhani', Zone: 'SCR' },

  // ==========================================
  // Madhya Pradesh
  // ==========================================
  { StationCode: 'INDB', NameEn: 'Indore Jn', NameHn: 'इंदौर जं.', State: 'Madhya Pradesh', City: 'Indore', Zone: 'WR' },
  { StationCode: 'DADN', NameEn: 'Dr. Ambedkar Nagar (Mhow)', NameHn: 'डॉ. अम्बेडकर नगर (महू)', State: 'Madhya Pradesh', City: 'Mhow', Zone: 'WR' },
  { StationCode: 'LMNR', NameEn: 'Laxmi Bai Nagar (Indore)', NameHn: 'लक्ष्मी बाई नगर', State: 'Madhya Pradesh', City: 'Indore', Zone: 'WR' },
  { StationCode: 'BPL', NameEn: 'Bhopal Jn', NameHn: 'भोपाल जं.', State: 'Madhya Pradesh', City: 'Bhopal', Zone: 'WCR' },
  { StationCode: 'RKMP', NameEn: 'Rani Kamlapati (Habibganj)', NameHn: 'रानी कमलापति', State: 'Madhya Pradesh', City: 'Bhopal', Zone: 'WCR' },
  { StationCode: 'UJN', NameEn: 'Ujjain Jn', NameHn: 'उज्जैन जं.', State: 'Madhya Pradesh', City: 'Ujjain', Zone: 'WR' },
  { StationCode: 'GWL', NameEn: 'Gwalior Jn', NameHn: 'ग्वालियर जं.', State: 'Madhya Pradesh', City: 'Gwalior', Zone: 'NCR' },
  { StationCode: 'JBP', NameEn: 'Jabalpur Jn', NameHn: 'जबलपुर जं.', State: 'Madhya Pradesh', City: 'Jabalpur', Zone: 'WCR' },
  { StationCode: 'ET', NameEn: 'Itarsi Jn', NameHn: 'इटारसी जं.', State: 'Madhya Pradesh', City: 'Itarsi', Zone: 'WCR' },
  { StationCode: 'RTM', NameEn: 'Ratlam Jn', NameHn: 'रतलाम जं.', State: 'Madhya Pradesh', City: 'Ratlam', Zone: 'WR' },
  { StationCode: 'KNW', NameEn: 'Khandwa Jn', NameHn: 'खंडवा जं.', State: 'Madhya Pradesh', City: 'Khandwa', Zone: 'CR' },
  { StationCode: 'KTE', NameEn: 'Katni Jn', NameHn: 'कटनी जं.', State: 'Madhya Pradesh', City: 'Katni', Zone: 'WCR' },
  { StationCode: 'STA', NameEn: 'Satna Jn', NameHn: 'सतना जं.', State: 'Madhya Pradesh', City: 'Satna', Zone: 'WCR' },
  { StationCode: 'REWA', NameEn: 'Rewa', NameHn: 'रीवा', State: 'Madhya Pradesh', City: 'Rewa', Zone: 'WCR' },
  { StationCode: 'SGO', NameEn: 'Saugor (Sagar)', NameHn: 'सागर', State: 'Madhya Pradesh', City: 'Sagar', Zone: 'WCR' },
  { StationCode: 'DMO', NameEn: 'Damoh', NameHn: 'दमोह', State: 'Madhya Pradesh', City: 'Damoh', Zone: 'WCR' },
  { StationCode: 'BINA', NameEn: 'Bina Jn', NameHn: 'बीना जं.', State: 'Madhya Pradesh', City: 'Bina', Zone: 'WCR' },
  { StationCode: 'DWX', NameEn: 'Dewas Jn', NameHn: 'देवास जं.', State: 'Madhya Pradesh', City: 'Dewas', Zone: 'WR' },
  { StationCode: 'NAD', NameEn: 'Nagda Jn', NameHn: 'नागदा जं.', State: 'Madhya Pradesh', City: 'Nagda', Zone: 'WR' },
  { StationCode: 'MDS', NameEn: 'Mandsaur', NameHn: 'मंदसौर', State: 'Madhya Pradesh', City: 'Mandsaur', Zone: 'WR' },
  { StationCode: 'NMH', NameEn: 'Neemuch', NameHn: 'नीमच', State: 'Madhya Pradesh', City: 'Neemuch', Zone: 'WR' },
  { StationCode: 'SHRN', NameEn: 'Sant Hirdaram Nagar (Bairagarh)', NameHn: 'संत हिरदाराम नगर', State: 'Madhya Pradesh', City: 'Bhopal', Zone: 'WCR' },
  { StationCode: 'HD', NameEn: 'Harda', NameHn: 'हरदा', State: 'Madhya Pradesh', City: 'Harda', Zone: 'WCR' },
  { StationCode: 'PPI', NameEn: 'Pipariya (Pachmarhi)', NameHn: 'पिपरिया', State: 'Madhya Pradesh', City: 'Pipariya', Zone: 'WCR' },
  { StationCode: 'GAR', NameEn: 'Gadarwara', NameHn: 'गाडरवारा', State: 'Madhya Pradesh', City: 'Gadarwara', Zone: 'WCR' },
  { StationCode: 'NU', NameEn: 'Narsinghpur', NameHn: 'नरसिंहपुर', State: 'Madhya Pradesh', City: 'Narsinghpur', Zone: 'WCR' },
  { StationCode: 'BNDP', NameEn: 'Bhind', NameHn: 'भिंड', State: 'Madhya Pradesh', City: 'Bhind', Zone: 'NCR' },
  { StationCode: 'MRA', NameEn: 'Morena', NameHn: 'मुरैना', State: 'Madhya Pradesh', City: 'Morena', Zone: 'NCR' },
  { StationCode: 'KMZ', NameEn: 'Katni Murwara', NameHn: 'कटनी मुड़वारा', State: 'Madhya Pradesh', City: 'Katni', Zone: 'WCR' },
  { StationCode: 'SDL', NameEn: 'Shahdol', NameHn: 'शहडोल', State: 'Madhya Pradesh', City: 'Shahdol', Zone: 'SECR' },
  { StationCode: 'APR', NameEn: 'Anuppur Jn', NameHn: 'अनूपपुर जं.', State: 'Madhya Pradesh', City: 'Anuppur', Zone: 'SECR' },
  { StationCode: 'CWA', NameEn: 'Chhindwara Jn', NameHn: 'छिंदवाड़ा जं.', State: 'Madhya Pradesh', City: 'Chhindwara', Zone: 'SECR' },

  // ==========================================
  // Gujarat
  // ==========================================
  { StationCode: 'ADI', NameEn: 'Ahmedabad Jn', NameHn: 'अहमदाबाद जं.', State: 'Gujarat', City: 'Ahmedabad', Zone: 'WR' },
  { StationCode: 'ST', NameEn: 'Surat', NameHn: 'सूरत', State: 'Gujarat', City: 'Surat', Zone: 'WR' },
  { StationCode: 'BRC', NameEn: 'Vadodara Jn', NameHn: 'वडोदरा जं.', State: 'Gujarat', City: 'Vadodara', Zone: 'WR' },
  { StationCode: 'RJT', NameEn: 'Rajkot Jn', NameHn: 'राजकोट जं.', State: 'Gujarat', City: 'Rajkot', Zone: 'WR' },
  { StationCode: 'BVC', NameEn: 'Bhavnagar Terminus', NameHn: 'भावनगर', State: 'Gujarat', City: 'Bhavnagar', Zone: 'WR' },
  { StationCode: 'JAM', NameEn: 'Jamnagar', NameHn: 'जामनगर', State: 'Gujarat', City: 'Jamnagar', Zone: 'WR' },
  { StationCode: 'BH', NameEn: 'Bharuch Jn', NameHn: 'भरूच जं.', State: 'Gujarat', City: 'Bharuch', Zone: 'WR' },
  { StationCode: 'ANND', NameEn: 'Anand Jn', NameHn: 'आणंद जं.', State: 'Gujarat', City: 'Anand', Zone: 'WR' },
  { StationCode: 'ND', NameEn: 'Nadiad Jn', NameHn: 'नडियाद जं.', State: 'Gujarat', City: 'Nadiad', Zone: 'WR' },
  { StationCode: 'BL', NameEn: 'Valsad', NameHn: 'वलसाड', State: 'Gujarat', City: 'Valsad', Zone: 'WR' },
  { StationCode: 'VAPI', NameEn: 'Vapi', NameHn: 'वापी', State: 'Gujarat', City: 'Vapi', Zone: 'WR' },
  { StationCode: 'GIMB', NameEn: 'Gandhidham Jn', NameHn: 'गांधीधाम', State: 'Gujarat', City: 'Gandhidham', Zone: 'WR' },
  { StationCode: 'BHUJ', NameEn: 'Bhuj', NameHn: 'भुज', State: 'Gujarat', City: 'Bhuj', Zone: 'WR' },
  { StationCode: 'DWK', NameEn: 'Dwarka', NameHn: 'द्वारका', State: 'Gujarat', City: 'Dwarka', Zone: 'WR' },
  { StationCode: 'VRL', NameEn: 'Veraval Jn (Somnath)', NameHn: 'वेरावल जं.', State: 'Gujarat', City: 'Veraval', Zone: 'WR' },
  { StationCode: 'SMNH', NameEn: 'Shri Somnath', NameHn: 'श्री सोमनाथ', State: 'Gujarat', City: 'Somnath', Zone: 'WR' },
  { StationCode: 'PNU', NameEn: 'Palanpur Jn', NameHn: 'पालनपुर जं.', State: 'Gujarat', City: 'Palanpur', Zone: 'WR' },
  { StationCode: 'MSH', NameEn: 'Mahesana Jn', NameHn: 'महेसाणा जं.', State: 'Gujarat', City: 'Mahesana', Zone: 'WR' },
  { StationCode: 'GNC', NameEn: 'Gandhinagar Capital', NameHn: 'गांधीनगर कैपिटल', State: 'Gujarat', City: 'Gandhinagar', Zone: 'WR' },
  { StationCode: 'SBIB', NameEn: 'Sabarmati BG', NameHn: 'साबरमती बीजी', State: 'Gujarat', City: 'Ahmedabad', Zone: 'WR' },
  { StationCode: 'SUNR', NameEn: 'Surendranagar', NameHn: 'सुरेंद्रनगर', State: 'Gujarat', City: 'Surendranagar', Zone: 'WR' },
  { StationCode: 'OKHA', NameEn: 'Okha', NameHn: 'ओखा', State: 'Gujarat', City: 'Okha', Zone: 'WR' },
  { StationCode: 'NVS', NameEn: 'Navsari', NameHn: 'नवसारी', State: 'Gujarat', City: 'Navsari', Zone: 'WR' },
  { StationCode: 'GDA', NameEn: 'Godhra Jn', NameHn: 'गोधरा जं.', State: 'Gujarat', City: 'Godhra', Zone: 'WR' },
  { StationCode: 'DHD', NameEn: 'Dahod', NameHn: 'दाहोद', State: 'Gujarat', City: 'Dahod', Zone: 'WR' },

  // ==========================================
  // Uttar Pradesh
  // ==========================================
  { StationCode: 'CNB', NameEn: 'Kanpur Central', NameHn: 'कानपुर सेंट्रल', State: 'Uttar Pradesh', City: 'Kanpur', Zone: 'NCR' },
  { StationCode: 'CPA', NameEn: 'Kanpur Anwarganj', NameHn: 'कानपुर अनवरगंज', State: 'Uttar Pradesh', City: 'Kanpur', Zone: 'NER' },
  { StationCode: 'LKO', NameEn: 'Lucknow Charbagh NR', NameHn: 'लखनऊ चारबाग', State: 'Uttar Pradesh', City: 'Lucknow', Zone: 'NR' },
  { StationCode: 'LJN', NameEn: 'Lucknow Jn NER', NameHn: 'लखनऊ जं.', State: 'Uttar Pradesh', City: 'Lucknow', Zone: 'NER' },
  { StationCode: 'PRYJ', NameEn: 'Prayagraj Jn (Allahabad)', NameHn: 'प्रयागराज जं.', State: 'Uttar Pradesh', City: 'Prayagraj', Zone: 'NCR' },
  { StationCode: 'PRRB', NameEn: 'Prayagraj Rambag', NameHn: 'प्रयागराज रामबाग', State: 'Uttar Pradesh', City: 'Prayagraj', Zone: 'NER' },
  { StationCode: 'BSB', NameEn: 'Varanasi Jn', NameHn: 'वाराणसी जं.', State: 'Uttar Pradesh', City: 'Varanasi', Zone: 'NR' },
  { StationCode: 'BSBS', NameEn: 'Banaras (Manduadih)', NameHn: 'बनारस', State: 'Uttar Pradesh', City: 'Varanasi', Zone: 'NER' },
  { StationCode: 'DDU', NameEn: 'Pt. Deen Dayal Upadhyaya Jn', NameHn: 'पं. दीनदयाल उपाध्याय जं.', State: 'Uttar Pradesh', City: 'Mughalsarai', Zone: 'ECR' },
  { StationCode: 'GKP', NameEn: 'Gorakhpur Jn', NameHn: 'गोरखपुर जं.', State: 'Uttar Pradesh', City: 'Gorakhpur', Zone: 'NER' },
  { StationCode: 'AGC', NameEn: 'Agra Cantt', NameHn: 'आगरा कैंट', State: 'Uttar Pradesh', City: 'Agra', Zone: 'NCR' },
  { StationCode: 'AF', NameEn: 'Agra Fort', NameHn: 'आगरा फोर्ट', State: 'Uttar Pradesh', City: 'Agra', Zone: 'NCR' },
  { StationCode: 'MTJ', NameEn: 'Mathura Jn', NameHn: 'मथुरा जं.', State: 'Uttar Pradesh', City: 'Mathura', Zone: 'NCR' },
  { StationCode: 'JHS', NameEn: 'Virangana Lakshmibai Jhansi', NameHn: 'झांसी जं.', State: 'Uttar Pradesh', City: 'Jhansi', Zone: 'NCR' },
  { StationCode: 'AY', NameEn: 'Ayodhya Dham Jn', NameHn: 'अयोध्या धाम जं.', State: 'Uttar Pradesh', City: 'Ayodhya', Zone: 'NR' },
  { StationCode: 'AYC', NameEn: 'Ayodhya Cantt', NameHn: 'अयोध्या कैंट', State: 'Uttar Pradesh', City: 'Ayodhya', Zone: 'NR' },
  { StationCode: 'MB', NameEn: 'Moradabad Jn', NameHn: 'मुरादाबाद', State: 'Uttar Pradesh', City: 'Moradabad', Zone: 'NR' },
  { StationCode: 'BE', NameEn: 'Bareilly Jn', NameHn: 'बरेली जं.', State: 'Uttar Pradesh', City: 'Bareilly', Zone: 'NR' },
  { StationCode: 'ALJN', NameEn: 'Aligarh Jn', NameHn: 'अलीगढ़ जं.', State: 'Uttar Pradesh', City: 'Aligarh', Zone: 'NCR' },
  { StationCode: 'SRE', NameEn: 'Saharanpur Jn', NameHn: 'सहारनपुर', State: 'Uttar Pradesh', City: 'Saharanpur', Zone: 'NR' },
  { StationCode: 'MTC', NameEn: 'Meerut City Jn', NameHn: 'मेरठ सिटी', State: 'Uttar Pradesh', City: 'Meerut', Zone: 'NR' },
  { StationCode: 'MUT', NameEn: 'Meerut Cantt', NameHn: 'मेरठ कैंट', State: 'Uttar Pradesh', City: 'Meerut', Zone: 'NR' },
  { StationCode: 'HPU', NameEn: 'Hapur Jn', NameHn: 'हापुड़', State: 'Uttar Pradesh', City: 'Hapur', Zone: 'NR' },
  { StationCode: 'AMRO', NameEn: 'Amroha', NameHn: 'अमरोहा', State: 'Uttar Pradesh', City: 'Amroha', Zone: 'NR' },
  { StationCode: 'CH', NameEn: 'Chandausi Jn', NameHn: 'चंदौसी', State: 'Uttar Pradesh', City: 'Chandausi', Zone: 'NR' },
  { StationCode: 'SPN', NameEn: 'Shahjahanpur', NameHn: 'शाहजहांपुर', State: 'Uttar Pradesh', City: 'Shahjahanpur', Zone: 'NR' },
  { StationCode: 'HRI', NameEn: 'Hardoi', NameHn: 'हरदोई', State: 'Uttar Pradesh', City: 'Hardoi', Zone: 'NR' },
  { StationCode: 'ON', NameEn: 'Unnao Jn', NameHn: 'उन्नाव', State: 'Uttar Pradesh', City: 'Unnao', Zone: 'NR' },
  { StationCode: 'ETW', NameEn: 'Etawah Jn', NameHn: 'इटावा', State: 'Uttar Pradesh', City: 'Etawah', Zone: 'NCR' },
  { StationCode: 'TDL', NameEn: 'Tundla Jn', NameHn: 'टूंडला', State: 'Uttar Pradesh', City: 'Tundla', Zone: 'NCR' },
  { StationCode: 'FZD', NameEn: 'Firozabad', NameHn: 'फिरोजाबाद', State: 'Uttar Pradesh', City: 'Firozabad', Zone: 'NCR' },
  { StationCode: 'FTP', NameEn: 'Fatehpur', NameHn: 'फतेहपुर', State: 'Uttar Pradesh', City: 'Fatehpur', Zone: 'NCR' },
  { StationCode: 'MZP', NameEn: 'Mirzapur', NameHn: 'मिर्ज़ापुर', State: 'Uttar Pradesh', City: 'Mirzapur', Zone: 'NCR' },
  { StationCode: 'BUI', NameEn: 'Ballia', NameHn: 'बलिया', State: 'Uttar Pradesh', City: 'Ballia', Zone: 'NER' },
  { StationCode: 'MAU', NameEn: 'Mau Jn', NameHn: 'मऊ जं.', State: 'Uttar Pradesh', City: 'Mau', Zone: 'NER' },
  { StationCode: 'AMH', NameEn: 'Azamgarh', NameHn: 'आजमगढ़', State: 'Uttar Pradesh', City: 'Azamgarh', Zone: 'NER' },
  { StationCode: 'GD', NameEn: 'Gonda Jn', NameHn: 'गोंडा जं.', State: 'Uttar Pradesh', City: 'Gonda', Zone: 'NER' },
  { StationCode: 'BST', NameEn: 'Basti', NameHn: 'बस्ती', State: 'Uttar Pradesh', City: 'Basti', Zone: 'NER' },
  { StationCode: 'DEOS', NameEn: 'Deoria Sadar', NameHn: 'देवरिया सदर', State: 'Uttar Pradesh', City: 'Deoria', Zone: 'NER' },
  { StationCode: 'BLP', NameEn: 'Balrampur', NameHn: 'बलरामपुर', State: 'Uttar Pradesh', City: 'Balrampur', Zone: 'NER' },
  { StationCode: 'STP', NameEn: 'Sitapur Jn', NameHn: 'सीतापुर', State: 'Uttar Pradesh', City: 'Sitapur', Zone: 'NER' },
  { StationCode: 'LMP', NameEn: 'Lakhimpur', NameHn: 'लखीमपुर', State: 'Uttar Pradesh', City: 'Lakhimpur', Zone: 'NER' },
  { StationCode: 'FD', NameEn: 'Faizabad Jn', NameHn: 'फैजाबाद', State: 'Uttar Pradesh', City: 'Ayodhya', Zone: 'NR' },
  { StationCode: 'RBL', NameEn: 'Rae Bareli Jn', NameHn: 'रायबरेली', State: 'Uttar Pradesh', City: 'Rae Bareli', Zone: 'NR' },
  { StationCode: 'PBH', NameEn: 'Pratapgarh Jn', NameHn: 'प्रतापगढ़', State: 'Uttar Pradesh', City: 'Pratapgarh', Zone: 'NR' },
  { StationCode: 'JOP', NameEn: 'Jaunpur City', NameHn: 'जौनपुर सिटी', State: 'Uttar Pradesh', City: 'Jaunpur', Zone: 'NR' },
  { StationCode: 'JNU', NameEn: 'Jaunpur Jn', NameHn: 'जौनपुर जं.', State: 'Uttar Pradesh', City: 'Jaunpur', Zone: 'NR' },
  { StationCode: 'BNDA', NameEn: 'Banda', NameHn: 'बांदा', State: 'Uttar Pradesh', City: 'Banda', Zone: 'NCR' },

  // ==========================================
  // West Bengal
  // ==========================================
  { StationCode: 'HWH', NameEn: 'Howrah Jn', NameHn: 'हावड़ा जं.', State: 'West Bengal', City: 'Kolkata', Zone: 'ER' },
  { StationCode: 'SDAH', NameEn: 'Sealdah', NameHn: 'सियालदह', State: 'West Bengal', City: 'Kolkata', Zone: 'ER' },
  { StationCode: 'KOAA', NameEn: 'Kolkata (Chitpur)', NameHn: 'कोलकाता', State: 'West Bengal', City: 'Kolkata', Zone: 'ER' },
  { StationCode: 'SHM', NameEn: 'Shalimar', NameHn: 'शालीमार', State: 'West Bengal', City: 'Kolkata', Zone: 'SER' },
  { StationCode: 'SRC', NameEn: 'Santragachi Jn', NameHn: 'संत्रागाछी', State: 'West Bengal', City: 'Howrah', Zone: 'SER' },
  { StationCode: 'ASN', NameEn: 'Asansol Jn', NameHn: 'आसनसोल जं.', State: 'West Bengal', City: 'Asansol', Zone: 'ER' },
  { StationCode: 'DGR', NameEn: 'Durgapur', NameHn: 'दुर्गापुर', State: 'West Bengal', City: 'Durgapur', Zone: 'ER' },
  { StationCode: 'BWN', NameEn: 'Barddhaman Jn', NameHn: 'बर्द्धमान जं.', State: 'West Bengal', City: 'Bardhaman', Zone: 'ER' },
  { StationCode: 'BDC', NameEn: 'Bandel Jn', NameHn: 'बैंडेल जं.', State: 'West Bengal', City: 'Bandel', Zone: 'ER' },
  { StationCode: 'KGP', NameEn: 'Kharagpur Jn', NameHn: 'खड़गपुर जं.', State: 'West Bengal', City: 'Kharagpur', Zone: 'SER' },
  { StationCode: 'MDN', NameEn: 'Medinipur', NameHn: 'मेदिनीपुर', State: 'West Bengal', City: 'Medinipur', Zone: 'SER' },
  { StationCode: 'NJP', NameEn: 'New Jalpaiguri (Siliguri)', NameHn: 'न्यू जलपाईगुड़ी', State: 'West Bengal', City: 'Siliguri', Zone: 'NFR' },
  { StationCode: 'SGUJ', NameEn: 'Siliguri Jn', NameHn: 'सिलीगुड़ी जं.', State: 'West Bengal', City: 'Siliguri', Zone: 'NFR' },
  { StationCode: 'MLDT', NameEn: 'Malda Town', NameHn: 'मालदा टाउन', State: 'West Bengal', City: 'Malda', Zone: 'ER' },
  { StationCode: 'RPH', NameEn: 'Rampurhat Jn', NameHn: 'रामपुरहाट', State: 'West Bengal', City: 'Rampurhat', Zone: 'ER' },
  { StationCode: 'BHP', NameEn: 'Bolpur Shantiniketan', NameHn: 'बोलपुर शांतिनिकेतन', State: 'West Bengal', City: 'Bolpur', Zone: 'ER' },
  { StationCode: 'DGHA', NameEn: 'Digha', NameHn: 'दीघा', State: 'West Bengal', City: 'Digha', Zone: 'SER' },
  { StationCode: 'APDJ', NameEn: 'Alipurduar Jn', NameHn: 'अलीपुरद्वार', State: 'West Bengal', City: 'Alipurduar', Zone: 'NFR' },
  { StationCode: 'NOQ', NameEn: 'New Alipurduar', NameHn: 'न्यू अलीपुरद्वार', State: 'West Bengal', City: 'Alipurduar', Zone: 'NFR' },
  { StationCode: 'NCB', NameEn: 'New Cooch Behar', NameHn: 'न्यू कूचबिहार', State: 'West Bengal', City: 'Cooch Behar', Zone: 'NFR' },

  // ==========================================
  // Bihar
  // ==========================================
  { StationCode: 'PNBE', NameEn: 'Patna Jn', NameHn: 'पटना जं.', State: 'Bihar', City: 'Patna', Zone: 'ECR' },
  { StationCode: 'DNR', NameEn: 'Danapur', NameHn: 'दानापुर', State: 'Bihar', City: 'Patna', Zone: 'ECR' },
  { StationCode: 'PPTA', NameEn: 'Patliputra Jn', NameHn: 'पाटलिपुत्र जं.', State: 'Bihar', City: 'Patna', Zone: 'ECR' },
  { StationCode: 'RJPB', NameEn: 'Rajendra Nagar Terminal (Patna)', NameHn: 'राजेन्द्र नगर टर्मिनल', State: 'Bihar', City: 'Patna', Zone: 'ECR' },
  { StationCode: 'DBG', NameEn: 'Darbhanga Jn', NameHn: 'दरभंगा जं.', State: 'Bihar', City: 'Darbhanga', Zone: 'ECR' },
  { StationCode: 'SPJ', NameEn: 'Samastipur Jn', NameHn: 'समस्तीपुर जं.', State: 'Bihar', City: 'Samastipur', Zone: 'ECR' },
  { StationCode: 'MFP', NameEn: 'Muzaffarpur Jn', NameHn: 'मुजफ्फरपुर जं.', State: 'Bihar', City: 'Muzaffarpur', Zone: 'ECR' },
  { StationCode: 'HJP', NameEn: 'Hajipur Jn', NameHn: 'हाजीपुर जं.', State: 'Bihar', City: 'Hajipur', Zone: 'ECR' },
  { StationCode: 'GAYA', NameEn: 'Gaya Jn', NameHn: 'गया जं.', State: 'Bihar', City: 'Gaya', Zone: 'ECR' },
  { StationCode: 'BJU', NameEn: 'Barauni Jn', NameHn: 'बरौनी जं.', State: 'Bihar', City: 'Barauni', Zone: 'ECR' },
  { StationCode: 'BGS', NameEn: 'Begusarai', NameHn: 'बेगूसराय', State: 'Bihar', City: 'Begusarai', Zone: 'ECR' },
  { StationCode: 'KIR', NameEn: 'Katihar Jn', NameHn: 'कटिहार जं.', State: 'Bihar', City: 'Katihar', Zone: 'NFR' },
  { StationCode: 'CPR', NameEn: 'Chhapra Jn', NameHn: 'छपरा जं.', State: 'Bihar', City: 'Chhapra', Zone: 'NER' },
  { StationCode: 'BXR', NameEn: 'Buxar', NameHn: 'बक्सर', State: 'Bihar', City: 'Buxar', Zone: 'ECR' },
  { StationCode: 'ARA', NameEn: 'Ara Jn', NameHn: 'आरा जं.', State: 'Bihar', City: 'Ara', Zone: 'ECR' },
  { StationCode: 'BKP', NameEn: 'Bakhtiyarpur Jn', NameHn: 'बख्तियारपुर', State: 'Bihar', City: 'Bakhtiyarpur', Zone: 'ECR' },
  { StationCode: 'MKA', NameEn: 'Mokama', NameHn: 'मोकामा', State: 'Bihar', City: 'Mokama', Zone: 'ECR' },
  { StationCode: 'KIUL', NameEn: 'Kiul Jn', NameHn: 'किऊल जं.', State: 'Bihar', City: 'Kiul', Zone: 'ECR' },
  { StationCode: 'JMP', NameEn: 'Jamalpur Jn', NameHn: 'जमालपुर जं.', State: 'Bihar', City: 'Jamalpur', Zone: 'ER' },
  { StationCode: 'BGP', NameEn: 'Bhagalpur Jn', NameHn: 'भागलपुर जं.', State: 'Bihar', City: 'Bhagalpur', Zone: 'ER' },
  { StationCode: 'SEE', NameEn: 'Sonpur Jn', NameHn: 'सोनपुर जं.', State: 'Bihar', City: 'Sonpur', Zone: 'ECR' },
  { StationCode: 'SV', NameEn: 'Siwan Jn', NameHn: 'सीवान जं.', State: 'Bihar', City: 'Siwan', Zone: 'NER' },
  { StationCode: 'BMKI', NameEn: 'Bapudham Motihari', NameHn: 'बापूधाम मोतिहारी', State: 'Bihar', City: 'Motihari', Zone: 'ECR' },
  { StationCode: 'SGL', NameEn: 'Sagauli Jn', NameHn: 'सुगौली', State: 'Bihar', City: 'Sagauli', Zone: 'ECR' },
  { StationCode: 'BTH', NameEn: 'Bettiah', NameHn: 'बेतिया', State: 'Bihar', City: 'Bettiah', Zone: 'ECR' },
  { StationCode: 'NKE', NameEn: 'Narkatiaganj Jn', NameHn: 'नरकटियागंज', State: 'Bihar', City: 'Narkatiaganj', Zone: 'ECR' },
  { StationCode: 'RXL', NameEn: 'Raxaul Jn', NameHn: 'रक्सौल जं.', State: 'Bihar', City: 'Raxaul', Zone: 'ECR' },
  { StationCode: 'JYG', NameEn: 'Jaynagar', NameHn: 'जयनगर', State: 'Bihar', City: 'Jaynagar', Zone: 'ECR' },
  { StationCode: 'MBI', NameEn: 'Madhubani', NameHn: 'मधुबनी', State: 'Bihar', City: 'Madhubani', Zone: 'ECR' },
  { StationCode: 'SHC', NameEn: 'Saharsa Jn', NameHn: 'सहरसा जं.', State: 'Bihar', City: 'Saharsa', Zone: 'ECR' },
  { StationCode: 'PRNC', NameEn: 'Purnea Court', NameHn: 'पूर्णिया कोर्ट', State: 'Bihar', City: 'Purnea', Zone: 'ECR' },
  { StationCode: 'KGG', NameEn: 'Khagaria Jn', NameHn: 'खगड़िया', State: 'Bihar', City: 'Khagaria', Zone: 'ECR' },
  { StationCode: 'MNE', NameEn: 'Mansi Jn', NameHn: 'मानसी', State: 'Bihar', City: 'Mansi', Zone: 'ECR' },
  { StationCode: 'NNA', NameEn: 'Naugachia', NameHn: 'नवगछिया', State: 'Bihar', City: 'Naugachia', Zone: 'ECR' },
  { StationCode: 'SSM', NameEn: 'Sasaram Jn', NameHn: 'सासाराम', State: 'Bihar', City: 'Sasaram', Zone: 'ECR' },
  { StationCode: 'DOS', NameEn: 'Dehri On Sone', NameHn: 'डेहरी ऑन सोन', State: 'Bihar', City: 'Dehri', Zone: 'ECR' },

  // ==========================================
  // Rajasthan
  // ==========================================
  { StationCode: 'JP', NameEn: 'Jaipur Jn', NameHn: 'जयपुर जं.', State: 'Rajasthan', City: 'Jaipur', Zone: 'NWR' },
  { StationCode: 'GADJ', NameEn: 'Gandhinagar Jaipur', NameHn: 'गांधीनगर जयपुर', State: 'Rajasthan', City: 'Jaipur', Zone: 'NWR' },
  { StationCode: 'AII', NameEn: 'Ajmer Jn', NameHn: 'अजमेर जं.', State: 'Rajasthan', City: 'Ajmer', Zone: 'NWR' },
  { StationCode: 'JU', NameEn: 'Jodhpur Jn', NameHn: 'जोधपुर जं.', State: 'Rajasthan', City: 'Jodhpur', Zone: 'NWR' },
  { StationCode: 'KOTA', NameEn: 'Kota Jn', NameHn: 'कोटा जं.', State: 'Rajasthan', City: 'Kota', Zone: 'WCR' },
  { StationCode: 'BKN', NameEn: 'Bikaner Jn', NameHn: 'बीकानेर जं.', State: 'Rajasthan', City: 'Bikaner', Zone: 'NWR' },
  { StationCode: 'UDZ', NameEn: 'Udaipur City', NameHn: 'उदयपुर सिटी', State: 'Rajasthan', City: 'Udaipur', Zone: 'NWR' },
  { StationCode: 'ABR', NameEn: 'Abu Road (Mount Abu)', NameHn: 'आबू रोड', State: 'Rajasthan', City: 'Mount Abu', Zone: 'NWR' },
  { StationCode: 'FL', NameEn: 'Phulera Jn', NameHn: 'फुलेरा जं.', State: 'Rajasthan', City: 'Phulera', Zone: 'NWR' },
  { StationCode: 'BHL', NameEn: 'Bhilwara', NameHn: 'भीलवाड़ा', State: 'Rajasthan', City: 'Bhilwara', Zone: 'NWR' },
  { StationCode: 'COR', NameEn: 'Chittaurgarh Jn', NameHn: 'चित्तौड़गढ़ जं.', State: 'Rajasthan', City: 'Chittorgarh', Zone: 'WR' },
  { StationCode: 'AWR', NameEn: 'Alwar Jn', NameHn: 'अलवर जं.', State: 'Rajasthan', City: 'Alwar', Zone: 'NWR' },
  { StationCode: 'BTE', NameEn: 'Bharatpur Jn', NameHn: 'भरतपुर जं.', State: 'Rajasthan', City: 'Bharatpur', Zone: 'WCR' },
  { StationCode: 'SWM', NameEn: 'Sawai Madhopur Jn', NameHn: 'सवाई माधोपुर', State: 'Rajasthan', City: 'Sawai Madhopur', Zone: 'WCR' },
  { StationCode: 'BXN', NameEn: 'Bayana Jn', NameHn: 'बयाना', State: 'Rajasthan', City: 'Bayana', Zone: 'WCR' },
  { StationCode: 'LGH', NameEn: 'Lalgarh Jn', NameHn: 'लालगढ़', State: 'Rajasthan', City: 'Bikaner', Zone: 'NWR' },
  { StationCode: 'SGNR', NameEn: 'Shri Ganganagar', NameHn: 'श्री गंगानगर', State: 'Rajasthan', City: 'Ganganagar', Zone: 'NWR' },
  { StationCode: 'HMH', NameEn: 'Hanumangarh Jn', NameHn: 'हनुमानगढ़', State: 'Rajasthan', City: 'Hanumangarh', Zone: 'NWR' },
  { StationCode: 'CUR', NameEn: 'Churu Jn', NameHn: 'चुरू', State: 'Rajasthan', City: 'Churu', Zone: 'NWR' },
  { StationCode: 'SIKR', NameEn: 'Sikar Jn', NameHn: 'सीकर', State: 'Rajasthan', City: 'Sikar', Zone: 'NWR' },
  { StationCode: 'DNA', NameEn: 'Degana Jn', NameHn: 'डेगाना', State: 'Rajasthan', City: 'Degana', Zone: 'NWR' },
  { StationCode: 'NGO', NameEn: 'Nagaur', NameHn: 'नागौर', State: 'Rajasthan', City: 'Nagaur', Zone: 'NWR' },
  { StationCode: 'MTD', NameEn: 'Merta Road Jn', NameHn: 'मेड़ता रोड', State: 'Rajasthan', City: 'Merta', Zone: 'NWR' },
  { StationCode: 'MJ', NameEn: 'Marwar Jn', NameHn: 'मारवाड़ जं.', State: 'Rajasthan', City: 'Marwar', Zone: 'NWR' },
  { StationCode: 'FA', NameEn: 'Falna', NameHn: 'फालना', State: 'Rajasthan', City: 'Falna', Zone: 'NWR' },
  { StationCode: 'JSM', NameEn: 'Jaisalmer', NameHn: 'जैसलमेर', State: 'Rajasthan', City: 'Jaisalmer', Zone: 'NWR' },
  { StationCode: 'BME', NameEn: 'Barmer', NameHn: 'बाड़मेर', State: 'Rajasthan', City: 'Barmer', Zone: 'NWR' },

  // ==========================================
  // Punjab, Haryana, Chandigarh, Himachal & J&K
  // ==========================================
  { StationCode: 'ASR', NameEn: 'Amritsar Jn', NameHn: 'अमृतसर जं.', State: 'Punjab', City: 'Amritsar', Zone: 'NR' },
  { StationCode: 'LDH', NameEn: 'Ludhiana Jn', NameHn: 'लुधियाना', State: 'Punjab', City: 'Ludhiana', Zone: 'NR' },
  { StationCode: 'JUC', NameEn: 'Jalandhar City', NameHn: 'जालंधर सिटी', State: 'Punjab', City: 'Jalandhar', Zone: 'NR' },
  { StationCode: 'JRC', NameEn: 'Jalandhar Cantt', NameHn: 'जालंधर कैंट', State: 'Punjab', City: 'Jalandhar', Zone: 'NR' },
  { StationCode: 'BEAS', NameEn: 'Beas', NameHn: 'ब्यास', State: 'Punjab', City: 'Beas', Zone: 'NR' },
  { StationCode: 'BTI', NameEn: 'Bathinda Jn', NameHn: 'बठिंडा जं.', State: 'Punjab', City: 'Bathinda', Zone: 'NR' },
  { StationCode: 'PTK', NameEn: 'Pathankot Jn', NameHn: 'पठानकोट', State: 'Punjab', City: 'Pathankot', Zone: 'NR' },
  { StationCode: 'PTKC', NameEn: 'Pathankot Cantt (Chakki Bank)', NameHn: 'पठानकोट कैंट', State: 'Punjab', City: 'Pathankot', Zone: 'NR' },
  { StationCode: 'PGW', NameEn: 'Phagwara Jn', NameHn: 'फगवाड़ा', State: 'Punjab', City: 'Phagwara', Zone: 'NR' },
  { StationCode: 'SIR', NameEn: 'Sirhind Jn', NameHn: 'सरहिंद', State: 'Punjab', City: 'Sirhind', Zone: 'NR' },
  { StationCode: 'CDG', NameEn: 'Chandigarh Jn', NameHn: 'चंडीगढ़ जं.', State: 'Chandigarh', City: 'Chandigarh', Zone: 'NR' },
  { StationCode: 'UMB', NameEn: 'Ambala Cantt', NameHn: 'अंबाला कैंट', State: 'Haryana', City: 'Ambala', Zone: 'NR' },
  { StationCode: 'KLK', NameEn: 'Kalka', NameHn: 'कालका', State: 'Haryana', City: 'Kalka', Zone: 'NR' },
  { StationCode: 'PNP', NameEn: 'Panipat Jn', NameHn: 'पानीपत', State: 'Haryana', City: 'Panipat', Zone: 'NR' },
  { StationCode: 'KUN', NameEn: 'Karnal', NameHn: 'करनाल', State: 'Haryana', City: 'Karnal', Zone: 'NR' },
  { StationCode: 'KKDE', NameEn: 'Kurukshetra Jn', NameHn: 'कुरुक्षेत्र', State: 'Haryana', City: 'Kurukshetra', Zone: 'NR' },
  { StationCode: 'ROK', NameEn: 'Rohtak Jn', NameHn: 'रोहतक', State: 'Haryana', City: 'Rohtak', Zone: 'NR' },
  { StationCode: 'RE', NameEn: 'Rewari Jn', NameHn: 'रेवाड़ी', State: 'Haryana', City: 'Rewari', Zone: 'NWR' },
  { StationCode: 'HSR', NameEn: 'Hisar Jn', NameHn: 'हिसार', State: 'Haryana', City: 'Hisar', Zone: 'NWR' },
  { StationCode: 'JAT', NameEn: 'Jammu Tawi', NameHn: 'जम्मू तवी', State: 'Jammu and Kashmir', City: 'Jammu', Zone: 'NR' },
  { StationCode: 'SVDK', NameEn: 'Shri Mata Vaishno Devi Katra', NameHn: 'श्री माता वैष्णो देवी कटरा', State: 'Jammu and Kashmir', City: 'Katra', Zone: 'NR' },
  { StationCode: 'UHP', NameEn: 'MCTM Udhampur', NameHn: 'उधमपुर', State: 'Jammu and Kashmir', City: 'Udhampur', Zone: 'NR' },
  { StationCode: 'HW', NameEn: 'Haridwar Jn', NameHn: 'हरिद्वार जं.', State: 'Uttarakhand', City: 'Haridwar', Zone: 'NR' },
  { StationCode: 'DDN', NameEn: 'Dehradun', NameHn: 'देहरादून', State: 'Uttarakhand', City: 'Dehradun', Zone: 'NR' },
  { StationCode: 'RK', NameEn: 'Roorkee', NameHn: 'रुड़की', State: 'Uttarakhand', City: 'Roorkee', Zone: 'NR' },
  { StationCode: 'KGM', NameEn: 'Kathgodam', NameHn: 'काठगोदाम', State: 'Uttarakhand', City: 'Kathgodam', Zone: 'NER' },
  { StationCode: 'LKU', NameEn: 'Lalkuan Jn', NameHn: 'लालकुआं', State: 'Uttarakhand', City: 'Lalkuan', Zone: 'NER' },

  // ==========================================
  // Karnataka
  // ==========================================
  { StationCode: 'SBC', NameEn: 'KSR Bengaluru City', NameHn: 'क्रांतिवीर संगोली रायण्णा बेंगलुरु', State: 'Karnataka', City: 'Bengaluru', Zone: 'SWR' },
  { StationCode: 'YPR', NameEn: 'Yesvantpur Jn', NameHn: 'यशवंतपुर जं.', State: 'Karnataka', City: 'Bengaluru', Zone: 'SWR' },
  { StationCode: 'SMVB', NameEn: 'SMVT Bengaluru', NameHn: 'सर एम. विश्वेश्वरैया बेंगलुरु', State: 'Karnataka', City: 'Bengaluru', Zone: 'SWR' },
  { StationCode: 'BNC', NameEn: 'Bengaluru Cantt', NameHn: 'बेंगलुरु कैंट', State: 'Karnataka', City: 'Bengaluru', Zone: 'SWR' },
  { StationCode: 'KJM', NameEn: 'Krishnarajapuram (Bengaluru)', NameHn: 'कृष्णराजपुरम', State: 'Karnataka', City: 'Bengaluru', Zone: 'SWR' },
  { StationCode: 'MYS', NameEn: 'Mysuru Jn', NameHn: 'मैसूर जं.', State: 'Karnataka', City: 'Mysuru', Zone: 'SWR' },
  { StationCode: 'UBL', NameEn: 'SSS Hubballi Jn', NameHn: 'हुबली जं.', State: 'Karnataka', City: 'Hubballi', Zone: 'SWR' },
  { StationCode: 'DWR', NameEn: 'Dharwad', NameHn: 'धारवाड़', State: 'Karnataka', City: 'Dharwad', Zone: 'SWR' },
  { StationCode: 'BGM', NameEn: 'Belagavi (Belgaum)', NameHn: 'बेलगाम', State: 'Karnataka', City: 'Belagavi', Zone: 'SWR' },
  { StationCode: 'BAY', NameEn: 'Ballari Jn (Bellary)', NameHn: 'बल्लारी जं.', State: 'Karnataka', City: 'Ballari', Zone: 'SWR' },
  { StationCode: 'HPT', NameEn: 'Hosapete Jn (Hampi)', NameHn: 'होसपेट (हम्पी)', State: 'Karnataka', City: 'Hosapete', Zone: 'SWR' },
  { StationCode: 'DVG', NameEn: 'Davangere', NameHn: 'दावणगेरे', State: 'Karnataka', City: 'Davangere', Zone: 'SWR' },
  { StationCode: 'ASK', NameEn: 'Arsikere Jn', NameHn: 'अरसीकेरे', State: 'Karnataka', City: 'Arsikere', Zone: 'SWR' },
  { StationCode: 'HAS', NameEn: 'Hassan Jn', NameHn: 'हासन', State: 'Karnataka', City: 'Hassan', Zone: 'SWR' },
  { StationCode: 'MAQ', NameEn: 'Mangaluru Central', NameHn: 'मंगलुरु सेंट्रल', State: 'Karnataka', City: 'Mangaluru', Zone: 'SR' },
  { StationCode: 'MAJN', NameEn: 'Mangaluru Jn', NameHn: 'मंगलुरु जं.', State: 'Karnataka', City: 'Mangaluru', Zone: 'SR' },
  { StationCode: 'UD', NameEn: 'Udupi', NameHn: 'उडुपी', State: 'Karnataka', City: 'Udupi', Zone: 'KR' },
  { StationCode: 'KLBG', NameEn: 'Kalaburagi (Gulbarga)', NameHn: 'कलबुरगी (गुलबर्गा)', State: 'Karnataka', City: 'Kalaburagi', Zone: 'CR' },
  { StationCode: 'WADI', NameEn: 'Wadi Jn', NameHn: 'वादी जं.', State: 'Karnataka', City: 'Wadi', Zone: 'CR' },
  { StationCode: 'RC', NameEn: 'Raichur Jn', NameHn: 'रायचूर', State: 'Karnataka', City: 'Raichur', Zone: 'SCR' },

  // ==========================================
  // Tamil Nadu
  // ==========================================
  { StationCode: 'MAS', NameEn: 'Chennai Central', NameHn: 'चेन्नई सेंट्रल', State: 'Tamil Nadu', City: 'Chennai', Zone: 'SR' },
  { StationCode: 'MS', NameEn: 'Chennai Egmore', NameHn: 'चेन्नई एग्मोर', State: 'Tamil Nadu', City: 'Chennai', Zone: 'SR' },
  { StationCode: 'TBM', NameEn: 'Tambaram', NameHn: 'तांबरम', State: 'Tamil Nadu', City: 'Chennai', Zone: 'SR' },
  { StationCode: 'PER', NameEn: 'Perambur (Chennai)', NameHn: 'पेरांबुर', State: 'Tamil Nadu', City: 'Chennai', Zone: 'SR' },
  { StationCode: 'CBE', NameEn: 'Coimbatore Jn', NameHn: 'कोयंबटूर जं.', State: 'Tamil Nadu', City: 'Coimbatore', Zone: 'SR' },
  { StationCode: 'MDU', NameEn: 'Madurai Jn', NameHn: 'मदुरै जं.', State: 'Tamil Nadu', City: 'Madurai', Zone: 'SR' },
  { StationCode: 'TPJ', NameEn: 'Tiruchchirappalli Jn', NameHn: 'तिरुचिरापल्ली जं.', State: 'Tamil Nadu', City: 'Trichy', Zone: 'SR' },
  { StationCode: 'SA', NameEn: 'Salem Jn', NameHn: 'सलेम जं.', State: 'Tamil Nadu', City: 'Salem', Zone: 'SR' },
  { StationCode: 'ED', NameEn: 'Erode Jn', NameHn: 'इरोड जं.', State: 'Tamil Nadu', City: 'Erode', Zone: 'SR' },
  { StationCode: 'TUP', NameEn: 'Tiruppur', NameHn: 'तिरुपूर', State: 'Tamil Nadu', City: 'Tiruppur', Zone: 'SR' },
  { StationCode: 'TEN', NameEn: 'Tirunelveli Jn', NameHn: 'तिरुनेलवेली', State: 'Tamil Nadu', City: 'Tirunelveli', Zone: 'SR' },
  { StationCode: 'CAPE', NameEn: 'Kanniyakumari', NameHn: 'कन्याकुमारी', State: 'Tamil Nadu', City: 'Kanyakumari', Zone: 'SR' },
  { StationCode: 'NCJ', NameEn: 'Nagercoil Jn', NameHn: 'नागरकोइल', State: 'Tamil Nadu', City: 'Nagercoil', Zone: 'SR' },
  { StationCode: 'RMM', NameEn: 'Rameswaram', NameHn: 'रामेश्वरम', State: 'Tamil Nadu', City: 'Rameswaram', Zone: 'SR' },
  { StationCode: 'KRR', NameEn: 'Karur Jn', NameHn: 'करूर', State: 'Tamil Nadu', City: 'Karur', Zone: 'SR' },
  { StationCode: 'DG', NameEn: 'Dindigul Jn', NameHn: 'डिंडीगुल', State: 'Tamil Nadu', City: 'Dindigul', Zone: 'SR' },
  { StationCode: 'KPD', NameEn: 'Katpadi Jn (Vellore)', NameHn: 'काटपाडी (वेल्लोर)', State: 'Tamil Nadu', City: 'Vellore', Zone: 'SR' },
  { StationCode: 'AJJ', NameEn: 'Arakkonam Jn', NameHn: 'अरक्कोणम', State: 'Tamil Nadu', City: 'Arakkonam', Zone: 'SR' },
  { StationCode: 'TJ', NameEn: 'Thanjavur Jn', NameHn: 'तंजावुर', State: 'Tamil Nadu', City: 'Thanjavur', Zone: 'SR' },
  { StationCode: 'MV', NameEn: 'Mayiladuturai Jn', NameHn: 'मयिलादुतुरै', State: 'Tamil Nadu', City: 'Mayiladuthurai', Zone: 'SR' },

  // ==========================================
  // Kerala
  // ==========================================
  { StationCode: 'TVC', NameEn: 'Thiruvananthapuram Central', NameHn: 'तिरुवनंतपुरम सेंट्रल', State: 'Kerala', City: 'Trivandrum', Zone: 'SR' },
  { StationCode: 'ERS', NameEn: 'Ernakulam Jn (South)', NameHn: 'एर्नाकुलम जं.', State: 'Kerala', City: 'Kochi', Zone: 'SR' },
  { StationCode: 'ERN', NameEn: 'Ernakulam Town (North)', NameHn: 'एर्नाकुलम टाउन', State: 'Kerala', City: 'Kochi', Zone: 'SR' },
  { StationCode: 'AWY', NameEn: 'Aluva (Kochi Airport)', NameHn: 'अलुवा', State: 'Kerala', City: 'Aluva', Zone: 'SR' },
  { StationCode: 'TCR', NameEn: 'Thrissur', NameHn: 'त्रिशूर', State: 'Kerala', City: 'Thrissur', Zone: 'SR' },
  { StationCode: 'SRR', NameEn: 'Shoranur Jn', NameHn: 'शोरणूर जं.', State: 'Kerala', City: 'Shoranur', Zone: 'SR' },
  { StationCode: 'PGT', NameEn: 'Palakkad Jn', NameHn: 'पालक्काड़', State: 'Kerala', City: 'Palakkad', Zone: 'SR' },
  { StationCode: 'CLT', NameEn: 'Kozhikode (Calicut)', NameHn: 'कोझिकोड', State: 'Kerala', City: 'Kozhikode', Zone: 'SR' },
  { StationCode: 'CAN', NameEn: 'Kannur', NameHn: 'कन्नूर', State: 'Kerala', City: 'Kannur', Zone: 'SR' },
  { StationCode: 'KGQ', NameEn: 'Kasaragod', NameHn: 'कासरगोड', State: 'Kerala', City: 'Kasaragod', Zone: 'SR' },
  { StationCode: 'ALLP', NameEn: 'Alappuzha (Alleppey)', NameHn: 'अलप्पुझा', State: 'Kerala', City: 'Alappuzha', Zone: 'SR' },
  { StationCode: 'KTYM', NameEn: 'Kottayam', NameHn: 'कोट्टायम', State: 'Kerala', City: 'Kottayam', Zone: 'SR' },
  { StationCode: 'QLN', NameEn: 'Kollam Jn', NameHn: 'कोल्लम जं.', State: 'Kerala', City: 'Kollam', Zone: 'SR' },
  { StationCode: 'KYJ', NameEn: 'Kayamkulam Jn', NameHn: 'कायमकुलम', State: 'Kerala', City: 'Kayamkulam', Zone: 'SR' },

  // ==========================================
  // Telangana & Andhra Pradesh
  // ==========================================
  { StationCode: 'SC', NameEn: 'Secunderabad Jn', NameHn: 'सिकंदराबाद जं.', State: 'Telangana', City: 'Hyderabad', Zone: 'SCR' },
  { StationCode: 'HYB', NameEn: 'Hyderabad Deccan (Nampally)', NameHn: 'हैदराबाद', State: 'Telangana', City: 'Hyderabad', Zone: 'SCR' },
  { StationCode: 'KCG', NameEn: 'Kacheguda', NameHn: 'काचीगुड़ा', State: 'Telangana', City: 'Hyderabad', Zone: 'SCR' },
  { StationCode: 'KZJ', NameEn: 'Kazipet Jn', NameHn: 'काजीपेट जं.', State: 'Telangana', City: 'Kazipet', Zone: 'SCR' },
  { StationCode: 'WL', NameEn: 'Warangal', NameHn: 'वारंगल', State: 'Telangana', City: 'Warangal', Zone: 'SCR' },
  { StationCode: 'KMT', NameEn: 'Khammam', NameHn: 'खम्मम', State: 'Telangana', City: 'Khammam', Zone: 'SCR' },
  { StationCode: 'RDM', NameEn: 'Ramagundam', NameHn: 'रामागुंडम', State: 'Telangana', City: 'Ramagundam', Zone: 'SCR' },
  { StationCode: 'MCI', NameEn: 'Manchiryal', NameHn: 'मंचेरियल', State: 'Telangana', City: 'Mancherial', Zone: 'SCR' },
  { StationCode: 'NZB', NameEn: 'Nizamabad Jn', NameHn: 'निज़ामाबाद', State: 'Telangana', City: 'Nizamabad', Zone: 'SCR' },
  { StationCode: 'BZA', NameEn: 'Vijayawada Jn', NameHn: 'विजयवाड़ा जं.', State: 'Andhra Pradesh', City: 'Vijayawada', Zone: 'SCR' },
  { StationCode: 'VSKP', NameEn: 'Visakhapatnam', NameHn: 'विशाखापट्टनम', State: 'Andhra Pradesh', City: 'Visakhapatnam', Zone: 'ECoR' },
  { StationCode: 'DVD', NameEn: 'Duvvada (Visakhapatnam)', NameHn: 'दुव्वाडा', State: 'Andhra Pradesh', City: 'Visakhapatnam', Zone: 'ECoR' },
  { StationCode: 'TPTY', NameEn: 'Tirupati', NameHn: 'तिरुपति', State: 'Andhra Pradesh', City: 'Tirupati', Zone: 'SCR' },
  { StationCode: 'RU', NameEn: 'Renigunta Jn', NameHn: 'रेणिगुंटा जं.', State: 'Andhra Pradesh', City: 'Tirupati', Zone: 'SCR' },
  { StationCode: 'GNT', NameEn: 'Guntur Jn', NameHn: 'गुंटूर जं.', State: 'Andhra Pradesh', City: 'Guntur', Zone: 'SCR' },
  { StationCode: 'RJY', NameEn: 'Rajahmundry', NameHn: 'राजमुंदरी', State: 'Andhra Pradesh', City: 'Rajahmundry', Zone: 'SCR' },
  { StationCode: 'SLO', NameEn: 'Samalkot Jn (Kakinada)', NameHn: 'सामलकोट', State: 'Andhra Pradesh', City: 'Samalkot', Zone: 'SCR' },
  { StationCode: 'CCT', NameEn: 'Kakinada Town', NameHn: 'काकीनाडा टाउन', State: 'Andhra Pradesh', City: 'Kakinada', Zone: 'SCR' },
  { StationCode: 'EE', NameEn: 'Eluru', NameHn: 'एलुरु', State: 'Andhra Pradesh', City: 'Eluru', Zone: 'SCR' },
  { StationCode: 'OGL', NameEn: 'Ongole', NameHn: 'ओंगोल', State: 'Andhra Pradesh', City: 'Ongole', Zone: 'SCR' },
  { StationCode: 'NLR', NameEn: 'Nellore', NameHn: 'नेल्लोर', State: 'Andhra Pradesh', City: 'Nellore', Zone: 'SCR' },
  { StationCode: 'GDR', NameEn: 'Gudur Jn', NameHn: 'गुडूर', State: 'Andhra Pradesh', City: 'Gudur', Zone: 'SCR' },
  { StationCode: 'KRNU', NameEn: 'Kurnool City', NameHn: 'कुरनूल सिटी', State: 'Andhra Pradesh', City: 'Kurnool', Zone: 'SCR' },
  { StationCode: 'DHNE', NameEn: 'Dhone Jn', NameHn: 'धोने जं.', State: 'Andhra Pradesh', City: 'Dhone', Zone: 'SCR' },
  { StationCode: 'GTL', NameEn: 'Guntakal Jn', NameHn: 'गुंतकल जं.', State: 'Andhra Pradesh', City: 'Guntakal', Zone: 'SCR' },
  { StationCode: 'ATP', NameEn: 'Anantapur', NameHn: 'अनंतपुर', State: 'Andhra Pradesh', City: 'Anantapur', Zone: 'SCR' },
  { StationCode: 'HX', NameEn: 'Kadapa (Cuddapah)', NameHn: 'कडपा', State: 'Andhra Pradesh', City: 'Kadapa', Zone: 'SCR' },
  { StationCode: 'VZM', NameEn: 'Vizianagaram Jn', NameHn: 'विजयनगरम', State: 'Andhra Pradesh', City: 'Vizianagaram', Zone: 'ECoR' },

  // ==========================================
  // Odisha, Chhattisgarh & Jharkhand
  // ==========================================
  { StationCode: 'BBS', NameEn: 'Bhubaneswar', NameHn: 'भुवनेश्वर', State: 'Odisha', City: 'Bhubaneswar', Zone: 'ECoR' },
  { StationCode: 'PURI', NameEn: 'Puri', NameHn: 'पुरी', State: 'Odisha', City: 'Puri', Zone: 'ECoR' },
  { StationCode: 'CTC', NameEn: 'Cuttack Jn', NameHn: 'कटक जं.', State: 'Odisha', City: 'Cuttack', Zone: 'ECoR' },
  { StationCode: 'ROU', NameEn: 'Rourkela Jn', NameHn: 'राउरकेला', State: 'Odisha', City: 'Rourkela', Zone: 'SER' },
  { StationCode: 'SBP', NameEn: 'Sambalpur Jn', NameHn: 'संबलपुर', State: 'Odisha', City: 'Sambalpur', Zone: 'ECoR' },
  { StationCode: 'BAM', NameEn: 'Brahmapur', NameHn: 'ब्रह्मपुर', State: 'Odisha', City: 'Brahmapur', Zone: 'ECoR' },
  { StationCode: 'BHC', NameEn: 'Bhadrak', NameHn: 'भद्रक', State: 'Odisha', City: 'Bhadrak', Zone: 'ECoR' },
  { StationCode: 'BLS', NameEn: 'Balasore', NameHn: 'बालासोर', State: 'Odisha', City: 'Balasore', Zone: 'SER' },
  { StationCode: 'JJKR', NameEn: 'Jajpur Keonjhar Road', NameHn: 'जाजपुर क्योंझर रोड', State: 'Odisha', City: 'Jajpur', Zone: 'ECoR' },
  { StationCode: 'KUR', NameEn: 'Khurda Road Jn', NameHn: 'खुरदा रोड', State: 'Odisha', City: 'Khurda', Zone: 'ECoR' },
  { StationCode: 'R', NameEn: 'Raipur Jn', NameHn: 'रायपुर जं.', State: 'Chhattisgarh', City: 'Raipur', Zone: 'SECR' },
  { StationCode: 'BSP', NameEn: 'Bilaspur Jn', NameHn: 'बिलासपुर जं.', State: 'Chhattisgarh', City: 'Bilaspur', Zone: 'SECR' },
  { StationCode: 'DURG', NameEn: 'Durg Jn', NameHn: 'दुर्ग जं.', State: 'Chhattisgarh', City: 'Durg', Zone: 'SECR' },
  { StationCode: 'BPHB', NameEn: 'Bhilai Power House', NameHn: 'भिलाई पावर हाउस', State: 'Chhattisgarh', City: 'Bhilai', Zone: 'SECR' },
  { StationCode: 'RIG', NameEn: 'Raigarh', NameHn: 'रायगढ़', State: 'Chhattisgarh', City: 'Raigarh', Zone: 'SECR' },
  { StationCode: 'CPH', NameEn: 'Champa Jn', NameHn: 'चांपा', State: 'Chhattisgarh', City: 'Champa', Zone: 'SECR' },
  { StationCode: 'KRBA', NameEn: 'Korba', NameHn: 'कोरबा', State: 'Chhattisgarh', City: 'Korba', Zone: 'SECR' },
  { StationCode: 'RJN', NameEn: 'Raj Nandgaon', NameHn: 'राजनंदगांव', State: 'Chhattisgarh', City: 'Rajnandgaon', Zone: 'SECR' },
  { StationCode: 'DHN', NameEn: 'Dhanbad Jn', NameHn: 'धनबाद जं.', State: 'Jharkhand', City: 'Dhanbad', Zone: 'ECR' },
  { StationCode: 'TATA', NameEn: 'Tatanagar Jn (Jamshedpur)', NameHn: 'टाटानगर जं.', State: 'Jharkhand', City: 'Jamshedpur', Zone: 'SER' },
  { StationCode: 'RNC', NameEn: 'Ranchi Jn', NameHn: 'रांची जं.', State: 'Jharkhand', City: 'Ranchi', Zone: 'SER' },
  { StationCode: 'HTE', NameEn: 'Hatia', NameHn: 'हटिया', State: 'Jharkhand', City: 'Ranchi', Zone: 'SER' },
  { StationCode: 'BKSC', NameEn: 'Bokaro Steel City', NameHn: 'बोकारो स्टील सिटी', State: 'Jharkhand', City: 'Bokaro', Zone: 'SER' },
  { StationCode: 'GMO', NameEn: 'NSCB Gomoh Jn', NameHn: 'गोमो जं.', State: 'Jharkhand', City: 'Gomoh', Zone: 'ECR' },
  { StationCode: 'PNME', NameEn: 'Parasnath (Shikharji)', NameHn: 'पारसनाथ', State: 'Jharkhand', City: 'Parasnath', Zone: 'ECR' },
  { StationCode: 'KQR', NameEn: 'Koderma Jn', NameHn: 'कोडरमा', State: 'Jharkhand', City: 'Koderma', Zone: 'ECR' },
  { StationCode: 'JSME', NameEn: 'Jasidih Jn (Deoghar)', NameHn: 'जसीडीह', State: 'Jharkhand', City: 'Deoghar', Zone: 'ER' },
  { StationCode: 'MDP', NameEn: 'Madhupur Jn', NameHn: 'मधुपुर', State: 'Jharkhand', City: 'Madhupur', Zone: 'ER' },
  { StationCode: 'CHKP', NameEn: 'Chakradharpur', NameHn: 'चक्रधरपुर', State: 'Jharkhand', City: 'Chakradharpur', Zone: 'SER' },

  // ==========================================
  // Assam, Northeast & Goa
  // ==========================================
  { StationCode: 'GHY', NameEn: 'Guwahati', NameHn: 'गुवाहाटी', State: 'Assam', City: 'Guwahati', Zone: 'NFR' },
  { StationCode: 'KYQ', NameEn: 'Kamakhya Jn', NameHn: 'कामाख्या', State: 'Assam', City: 'Guwahati', Zone: 'NFR' },
  { StationCode: 'DBRG', NameEn: 'Dibrugarh', NameHn: 'डिब्रूगढ़', State: 'Assam', City: 'Dibrugarh', Zone: 'NFR' },
  { StationCode: 'LMG', NameEn: 'Lumding Jn', NameHn: 'लमडिंग', State: 'Assam', City: 'Lumding', Zone: 'NFR' },
  { StationCode: 'NBQ', NameEn: 'New Bongaigaon', NameHn: 'न्यू बोंगाईगांव', State: 'Assam', City: 'Bongaigaon', Zone: 'NFR' },
  { StationCode: 'RNY', NameEn: 'Rangiya Jn', NameHn: 'रंगिया', State: 'Assam', City: 'Rangiya', Zone: 'NFR' },
  { StationCode: 'FKG', NameEn: 'Furkating Jn', NameHn: 'फुरकाटिंग', State: 'Assam', City: 'Furkating', Zone: 'NFR' },
  { StationCode: 'MXN', NameEn: 'Mariani Jn (Jorhat)', NameHn: 'मरियानी', State: 'Assam', City: 'Jorhat', Zone: 'NFR' },
  { StationCode: 'TSK', NameEn: 'Tinsukia Jn', NameHn: 'तिनसुकिया', State: 'Assam', City: 'Tinsukia', Zone: 'NFR' },
  { StationCode: 'NTSK', NameEn: 'New Tinsukia', NameHn: 'न्यू तिनसुकिया', State: 'Assam', City: 'Tinsukia', Zone: 'NFR' },
  { StationCode: 'SCL', NameEn: 'Silchar', NameHn: 'सिलचर', State: 'Assam', City: 'Silchar', Zone: 'NFR' },
  { StationCode: 'AGTL', NameEn: 'Agartala', NameHn: 'अगरतला', State: 'Tripura', City: 'Agartala', Zone: 'NFR' },
  { StationCode: 'MAO', NameEn: 'Madgaon Jn (Goa)', NameHn: 'मडगांव जं.', State: 'Goa', City: 'Madgaon', Zone: 'KR' },
  { StationCode: 'KRMI', NameEn: 'Karmali (Goa)', NameHn: 'करमली', State: 'Goa', City: 'Panaji', Zone: 'KR' },
  { StationCode: 'THVM', NameEn: 'Thivim (North Goa)', NameHn: 'थिविम', State: 'Goa', City: 'Mapusa', Zone: 'KR' },
  { StationCode: 'SWV', NameEn: 'Sawantwadi Road', NameHn: 'सावंतवाड़ी रोड', State: 'Maharashtra', City: 'Sawantwadi', Zone: 'KR' },
];

/**
 * Searches stations by code (prefix/contains) and English/Hindi name.
 * Returns sorted, high-relevance station matches.
 */
export function searchStations(query: string, limit = 8): IndianStation[] {
  const q = (query || '').trim().toUpperCase();
  if (!q) return INDIAN_STATIONS.slice(0, limit);

  const exactCodeMatches: IndianStation[] = [];
  const codePrefixMatches: IndianStation[] = [];
  const codeContainsMatches: IndianStation[] = [];
  const namePrefixMatches: IndianStation[] = [];
  const nameContainsMatches: IndianStation[] = [];
  const otherMatches: IndianStation[] = [];

  const seen = new Set<string>();

  for (const stn of INDIAN_STATIONS) {
    const code = stn.StationCode.toUpperCase();
    const name = stn.NameEn.toUpperCase();
    const city = (stn.City || '').toUpperCase();
    const state = (stn.State || '').toUpperCase();
    const hn = (stn.NameHn || '').toUpperCase();

    if (code === q) {
      exactCodeMatches.push(stn);
      seen.add(stn.StationCode);
    } else if (code.startsWith(q)) {
      codePrefixMatches.push(stn);
      seen.add(stn.StationCode);
    } else if (code.includes(q)) {
      codeContainsMatches.push(stn);
      seen.add(stn.StationCode);
    } else if (name.startsWith(q)) {
      namePrefixMatches.push(stn);
      seen.add(stn.StationCode);
    } else if (name.includes(q) || city.includes(q) || state.includes(q) || hn.includes(q)) {
      nameContainsMatches.push(stn);
      seen.add(stn.StationCode);
    }
  }

  const results = [
    ...exactCodeMatches,
    ...codePrefixMatches,
    ...namePrefixMatches,
    ...codeContainsMatches,
    ...nameContainsMatches,
    ...otherMatches,
  ];

  return results.slice(0, limit);
}

/**
 * Standard formatter for station display: "New Delhi (NDLS)"
 */
export function formatStationLabel(stn: IndianStation): string {
  return `${stn.NameEn} (${stn.StationCode})`;
}

/**
 * Extracts station code from a formatted string or code.
 * E.g. "New Delhi (NDLS)" -> "NDLS"
 */
export function extractStationCode(input: string): string {
  if (!input) return '';
  const match = input.match(/\(([A-Z0-9]{2,6})\)/i);
  if (match) return match[1].toUpperCase();
  const clean = input.trim().toUpperCase();
  if (clean.length <= 6 && /^[A-Z0-9]+$/.test(clean)) return clean;
  // If no parentheses, look for known station in dataset
  const found = INDIAN_STATIONS.find(
    (s) => s.NameEn.toUpperCase() === clean || s.StationCode === clean
  );
  if (found) return found.StationCode;
  return clean.slice(0, 5);
}
