const jarvisData = {
  user: {
    name: "Griezzy",
    location: "Kiambu, Nairobi"
  },
  ccna: {
    progress: 12,
    nextTopic: "Network Fundamentals",
    weeksLeft: 20,
    target: 100
  },
  loytex: {
    commission: 3000,
    frequency: "every 2 weeks",
    monthlyAverage: 6000
  },
  farmlink: {
    status: "Final stages",
    priority: "CRITICAL - Complete this week",
    completionEstimate: "This week"
  },
  schedule: {
    school: "2:30 PM",
    timezone: "EAT"
  }
};

function getSmartResponse(command) {
  const cmd = command.toLowerCase();
  
  if (cmd.includes('ccna')) {
    return `Your CCNA is at ${jarvisData.ccna.progress}%. Your next topic is ${jarvisData.ccna.nextTopic}. You need about ${jarvisData.ccna.weeksLeft} weeks to complete. Focus on consistent daily study.`;
  }
  
  if (cmd.includes('loytex')) {
    return `You earn ${jarvisData.loytex.commission} Kenyan Shillings from Loytex every 2 weeks. That's about ${jarvisData.loytex.monthlyAverage} Kenyan Shillings per month. Keep up the good work!`;
  }
  
  if (cmd.includes('farmlink')) {
    return `FarmLink is in ${jarvisData.farmlink.status}. This is your PRIORITY #1. You need to complete it fully this week. Once done, you can focus on other projects.`;
  }
  
  if (cmd.includes('school') || cmd.includes('schedule')) {
    return `Your school is at ${jarvisData.schedule.school} in the afternoon. Make sure you're there on time. Manage your study time before then.`;
  }
  
  if (cmd.includes('time')) {
    const now = new Date();
    return `It's currently ${now.toLocaleTimeString()}. You have school at ${jarvisData.schedule.school}.`;
  }
  
  if (cmd.includes('progress') || cmd.includes('how am i')) {
    return `You're progressing well! CCNA at ${jarvisData.ccna.progress}%, earning ${jarvisData.loytex.commission} KSh from Loytex, and FarmLink is almost done. Stay focused on completing FarmLink this week!`;
  }
  
  return `I can help with: CCNA progress, Loytex earnings, FarmLink status, your schedule, or how you're doing. What would you like to know?`;
}