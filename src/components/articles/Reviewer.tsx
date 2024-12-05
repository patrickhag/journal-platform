import React from 'react'
import { Button } from '../ui/button'

export default async function Reviewer({ reviewer: { email, names, affiliation, phone, expertise }, index }: {
  reviewer: {
    id: string;
    affiliation: string;
    email: string;
    userId: string;
    names: string;
    phone: string | null;
    expertise: string;
    articleId: string | null;
  }, index: number
}) {
  return (
    <>
      <h3 className="font-medium">{index + 1}<sup>{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}</sup> proposed reviewer</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Fullnames</h4>
          <p className="font-medium">{names}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Email</h4>
          <p className="font-medium">{email}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Affiliation</h4>
          <p className="font-medium">{affiliation}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Phone</h4>
          <p className="font-medium">{phone}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-muted-foreground mb-2">Expertise</h4>
        <p className="text-base">{expertise}</p>
      </div>

      <Button className="w-full md:w-auto">Reach out</Button>
    </>
  )
}

