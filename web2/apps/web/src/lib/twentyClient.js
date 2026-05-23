// Twenty CRM GraphQL client
// Docs: https://docs.twenty.com/developers/api-and-webhooks/api
// Auth: Bearer token (Settings → API & Webhooks → Create key)
// GraphQL endpoint: {TWENTY_API_URL}/graphql

const TWENTY_URL = import.meta.env.VITE_TWENTY_API_URL;
const TWENTY_KEY = import.meta.env.VITE_TWENTY_API_KEY;

async function gql(query, variables = {}) {
  if (!TWENTY_URL || !TWENTY_KEY || TWENTY_KEY === 'FILL_IN') {
    throw new Error('Twenty API not configured — set VITE_TWENTY_API_URL and VITE_TWENTY_API_KEY in .env');
  }

  const res = await fetch(`${TWENTY_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TWENTY_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`Twenty API HTTP ${res.status}`);

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return json.data;
}

// ── Opportunities (Pipeline) ──────────────────────────────────────────────────

export async function getOpportunities() {
  const data = await gql(`
    query GetOpportunities {
      opportunities(orderBy: { createdAt: DescNullsLast }) {
        edges {
          node {
            id
            name
            stage
            amount { amountMicros currencyCode }
            closeDate
            createdAt
            updatedAt
            pointOfContact {
              name { firstName lastName }
              emails { primaryEmail }
            }
            company {
              name
              domainName { primaryLinkUrl }
            }
          }
        }
      }
    }
  `);
  return data.opportunities.edges.map(e => e.node);
}

export async function updateOpportunityStage(id, stage) {
  const data = await gql(`
    mutation UpdateOpportunity($id: ID!, $stage: OpportunityStageEnum) {
      updateOpportunity(id: $id, data: { stage: $stage }) {
        id
        stage
      }
    }
  `, { id, stage });
  return data.updateOpportunity;
}

// ── People (Contacts) ─────────────────────────────────────────────────────────

export async function getPeople(first = 50) {
  const data = await gql(`
    query GetPeople($first: Int) {
      people(first: $first, orderBy: { createdAt: DescNullsLast }) {
        edges {
          node {
            id
            name { firstName lastName }
            emails { primaryEmail }
            phones { primaryPhoneNumber }
            city
            createdAt
            company {
              id
              name
            }
            opportunities {
              edges {
                node {
                  id
                  stage
                  amount { amountMicros currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `, { first });
  return data.people.edges.map(e => e.node);
}

// ── Companies ─────────────────────────────────────────────────────────────────

export async function getCompanies(first = 50) {
  const data = await gql(`
    query GetCompanies($first: Int) {
      companies(first: $first, orderBy: { createdAt: DescNullsLast }) {
        edges {
          node {
            id
            name
            domainName { primaryLinkUrl }
            employees
            annualRecurringRevenue { amountMicros currencyCode }
            createdAt
            people {
              edges {
                node {
                  id
                  name { firstName lastName }
                }
              }
            }
          }
        }
      }
    }
  `, { first });
  return data.companies.edges.map(e => e.node);
}

// ── Notes / Activity ──────────────────────────────────────────────────────────

export async function getNotes(first = 20) {
  const data = await gql(`
    query GetNotes($first: Int) {
      notes(first: $first, orderBy: { createdAt: DescNullsLast }) {
        edges {
          node {
            id
            title
            body
            createdAt
            author {
              name { firstName lastName }
            }
          }
        }
      }
    }
  `, { first });
  return data.notes.edges.map(e => e.node);
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export async function getTasks(first = 20) {
  const data = await gql(`
    query GetTasks($first: Int) {
      tasks(first: $first, orderBy: { createdAt: DescNullsLast }) {
        edges {
          node {
            id
            title
            status
            dueAt
            createdAt
            assignee {
              name { firstName lastName }
            }
          }
        }
      }
    }
  `, { first });
  return data.tasks.edges.map(e => e.node);
}

// ── Lead Creation (website intake → CRM) ─────────────────────────────────────

// Creates a Person + Opportunity in Twenty CRM from a quote form submission.
// Returns { person, opportunity } or throws on failure.
export async function createLead({ firstName, lastName, email, phone, province, monthlyBill, notes }) {
  // Step 1: create the contact (Person)
  const personData = await gql(`
    mutation CreatePerson($data: PersonCreateInput!) {
      createPerson(data: $data) {
        id
        name { firstName lastName }
      }
    }
  `, {
    data: {
      name: { firstName, lastName },
      emails: { primaryEmail: email },
      phones: { primaryPhoneNumber: phone },
      city: province,
    },
  });

  const person = personData.createPerson;

  // Step 2: create the opportunity linked to this person
  const oppName = `Solar Quote — ${firstName} ${lastName}`;
  const oppBody = [
    `Province: ${province}`,
    `Monthly Bill: $${monthlyBill}`,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean).join('\n');

  const oppData = await gql(`
    mutation CreateOpportunity($data: OpportunityCreateInput!) {
      createOpportunity(data: $data) {
        id
        name
        stage
      }
    }
  `, {
    data: {
      name: oppName,
      stage: 'NEW',
      pointOfContactId: person.id,
      body: oppBody,
    },
  });

  return { person, opportunity: oppData.createOpportunity };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Convert Twenty amountMicros to dollars
export function microsToDollars(micros) {
  if (!micros) return 0;
  return Math.round(micros / 1_000_000);
}

// Full name from Twenty name object
export function fullName(nameObj) {
  if (!nameObj) return 'Unknown';
  return [nameObj.firstName, nameObj.lastName].filter(Boolean).join(' ') || 'Unknown';
}

// Map Twenty opportunity stage to our pipeline columns
export const STAGE_MAP = {
  'NEW':              'New Lead',
  'SCREENING':        'Contacted',
  'MEETING':          'Site Survey Booked',
  'PROPOSAL':         'Proposal Sent',
  'CUSTOMER':         'Won',
  'CHURNED':          'Lost',
};

export const STAGE_REVERSE = Object.fromEntries(
  Object.entries(STAGE_MAP).map(([k, v]) => [v, k])
);

export function isConfigured() {
  return TWENTY_URL && TWENTY_KEY && TWENTY_KEY !== 'FILL_IN';
}
