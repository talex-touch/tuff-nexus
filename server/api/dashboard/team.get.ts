const team = {
  name: 'Core Operators',
  plan: 'preview',
  slots: {
    total: 5,
    used: 2,
  },
  members: [
    {
      id: 'me',
      name: 'You',
      role: 'Owner',
      status: 'active',
    },
    {
      id: 'ops-1',
      name: 'Automation Pilot',
      role: 'Automation Pilot',
      status: 'automation',
    },
  ],
  invitations: [],
  upcoming: {
    label: 'Teams preview opens',
    date: '2024-11-04',
  },
  notes:
    'Team sharing, role-based access, and audit trails are rolling out to preview tenants first. Request additional seats from the teams waitlist.',
}

export default defineEventHandler(() => {
  return {
    team,
  }
})
