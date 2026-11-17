import React, { useState } from 'react';

// Sample comprehensive database of listings shared by landlords across Kenya
const landlordListings = [
  {
    id: 1,
    county: 'Nakuru',
    town: 'Milimani',
    houseType: '2 Bedrooms',
    rent: 28000,
    water: 'Reliable (Council + Borehole)',
    security: 'High (Gated, CCTV, Guard 24/7)',
    isNewToTown: true,
  },
  {
    id: 2,
    county: 'Nairobi',
    town: 'Kilimani',
    houseType: 'Bedsitter',
    rent: 18000,
    water: 'Good (Council Water + Backup Tank)',
    security: 'High (Electric Fence, Biometric Access)',
    isNewToTown: false,
  },
  {
    id: 3,
    county: 'Kiambu',
    town: 'Ruiru',
    houseType: '1 Bedroom',
    rent: 15000,
    water: 'Moderate (Borehole-dependent)',
    security: 'Moderate (Fenced perimeter)',
    isNewToTown: true,
  },
  {
    id: 4,
    county: 'Nakuru',
    town: 'Nakuru City Center',
    houseType: 'Single Room',
    rent: 6500,
    water: 'Shared Tap (Consistent)',
    security: 'Moderate (CCTV monitored hallway)',
    isNewToTown: false,
  },
  {
    id: 5,
    county: 'Kajiado',
    town: 'Kitengela',
    houseType: 'Own Compound',
    rent: 45000,
    water: 'Private Borehole on Site',
    security: 'Very High (Gated Community, Patrol)',
    isNewToTown: true,
  },
];

export default function AiPropertyMatchFinder() {
  const [county, setCounty] = useState('Nakuru');
  const [town, setTown] = useState('Milimani');
  const [houseType, setHouseType] = useState('2 Bedrooms');
  const [budget, setBudget] = useState(30000);
  
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Agent logic to review listings against user budget, county, and town
  const handleAiSearchAndMatch = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAiRecommendation(null);

    setTimeout(() => {
      // Find matches where rent is <= budget and matches location/type filters
      const matches = landlordListings.filter((item) => {
        const matchesCounty = item.county.toLowerCase() === county.toLowerCase();
        const matchesTown = town === 'All Towns' || item.town.toLowerCase() === town.toLowerCase();
        const matchesType = houseType === 'All Types' || item.houseType.toLowerCase() === houseType.toLowerCase();
        const withinBudget = item.rent <= Number(budget);
        return matchesCounty && matchesTown && matchesType && withinBudget;
      });

      // If exact filter fails, let AI find the closest alternative within budget
      const bestMatch = matches.length > 0 
        ? matches[0] 
        : landlordListings.filter(item => item.rent <= Number(budget))[0] || null;

      setAiRecommendation(bestMatch);
      setIsAnalyzing(false);
    }, 1200); // Simulated AI deep-scan delay
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤖 Nyumbani Bill AI Matchmaker & Search</h2>
      <p style={styles.subtitle}>
        Select your preferences. Our AI agent will scan all verified landlord listings in Kenya, evaluating rent, security, and water availability to recommend the best home for you.
      </p>

      <form onSubmit={handleAiSearchAndMatch} style={styles.formGrid}>
        
        {/* County */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>County</label>
          <select value={county} onChange={(e) => setCounty(e.target.value)} style={styles.select}>
            <option value="Nakuru">Nakuru</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Kiambu">Kiambu</option>
            <option value="Kajiado">Kajiado</option>
          </select>
        </div>

        {/* Town / Ward */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Town / Ward / Area</label>
          <select value={town} onChange={(e) => setTown(e.target.value)} style={styles.select}>
            <option value="Milimani">Milimani</option>
            <option value="Nakuru City Center">Nakuru City Center</option>
            <option value="Kilimani">Kilimani</option>
            <option value="Ruiru">Ruiru</option>
            <option value="Kitengela">Kitengela</option>
          </select>
        </div>

        {/* House Type */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>House Type</label>
          <select value={houseType} onChange={(e) => setHouseType(e.target.value)} style={styles.select}>
            <option value="Single Room">Single Room</option>
            <option value="Bedsitter">Bedsitter</option>
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedrooms">2 Bedrooms</option>
            <option value="Own Compound">Own Compound</option>
          </select>
        </div>

        {/* Max Budget (Ksh) */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Max Budget (Ksh)</label>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)} 
            style={styles.input}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.button}>
            {isAnalyzing ? 'AI Agent Scanning Listings...' : '✨ Run AI Property Match'}
          </button>
        </div>

      </form>

      {/* AI Results Section */}
      {isAnalyzing && (
        <div style={styles.loadingBox}>
          <p style={styles.loadingText}>🔍 AI Agent is cross-referencing live landlord databases, water reliability indices, and security reports...</p>
        </div>
      )}

      {aiRecommendation && !isAnalyzing && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <h3 style={styles.resultTitle}>🎯 Best AI-Matched Property Found</h3>
            {aiRecommendation.isNewToTown && (
              <span style={styles.badge}>🔥 New Listing in Town</span>
            )}
          </div>

          <div style={styles.gridDetails}>
            <div>
              <p><strong>Property Type:</strong> {aiRecommendation.houseType}</p>
              <p><strong>Location:</strong> {aiRecommendation.town}, {aiRecommendation.county}</p>
              <p><strong>Monthly Rent:</strong> Ksh {aiRecommendation.rent.toLocaleString()}</p>
            </div>
            <div>
              <p><strong>💧 Water Availability:</strong> {aiRecommendation.water}</p>
              <p><strong>🛡️ Security Rating:</strong> {aiRecommendation.security}</p>
            </div>
          </div>

          <button style={styles.bookButton} onClick={() => alert('Redirecting to M-Pesa deposit / Lease agreement...')}>
            Secure This Property Now via Nyumbani Bill
          </button>
        </div>
      )}

      {!aiRecommendation && !isAnalyzing && budget && (
        <div style={styles.noResultBox}>
          <p>No exact match found within your specified budget of Ksh {Number(budget).toLocaleString()}. Try adjusting your budget or exploring nearby towns.</p>
        </div>
      )}

    </div>
  );
}

// Styling matching Nyumbani Bill dark navy branding
const styles = {
  container: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '30px',
    borderRadius: '16px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    alignItems: 'end',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: '6px',
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontSize: '14px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    fontSize: '14px',
  },
  buttonContainer: {
    display: 'flex',
  },
  button: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    fontSize: '14px',
  },
  loadingBox: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px dashed #3b82f6',
  },
  loadingText: {
    color: '#60a5fa',
    fontSize: '14px',
    margin: 0,
  },
  resultCard: {
    marginTop: '24px',
    backgroundColor: '#1e293b',
    border: '1px solid #3b82f6',
    borderRadius: '12px',
    padding: '20px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  resultTitle: {
    fontSize: '18px',
    color: '#38bdf8',
    margin: 0,
  },
  badge: {
    backgroundColor: '#f59e0b',
    color: '#000000',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  gridDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    fontSize: '14px',
    color: '#cbd5e1',
    marginBottom: '20px',
  },
  bookButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  noResultBox: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    color: '#f87171',
    textAlign: 'center',
    fontSize: '14px',
  },
};
