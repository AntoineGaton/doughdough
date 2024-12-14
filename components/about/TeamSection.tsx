'use client';

import { TeamMember } from './TeamMember';
import { motion } from 'framer-motion';

const TEAM_MEMBERS = [
  {
    name: "Emma Monroy- Rincon",
    position: "Product Owner",
    image: "/team/emma.jpg",
    linkedIn: "https://www.linkedin.com/in/emma-monroy-rincon-54a02bb0/i"
  },
  {
    name: "Lindy Nguyen",
    position: "Product Owner",
    image: "/team/lindy.jpg",
    linkedIn: "https://www.linkedin.com/in/lindy-nguyen-8a55272a8/"
  },
  {
    name: "Francesca Nazzal",
    position: "Scrum Master",
    image: "/team/francesca.jpeg",
    linkedIn: "https://www.linkedin.com/in/francesca-nazzal-457961159/"
  },
  {
    name: "Antoine Gaton",
    position: "Lead Developer",
    image: "/team/antoine.jpg",
    linkedIn: "https://www.linkedin.com/in/antoine-gaton/"
  },
  {
    name: "Wesley McElhinny",
    position: "Junior Developer",
    image: "/team/wesley.jpg",
    linkedIn: "https://www.linkedin.com/in/wesley-mcelhinny/"
  }
];

// Group members by position
const GROUPED_MEMBERS = {
  "Product Owner": TEAM_MEMBERS.filter(m => m.position === "Product Owner"),
  "Scrum Master": TEAM_MEMBERS.filter(m => m.position === "Scrum Master"),
  "Developers": TEAM_MEMBERS.filter(m => m.position.includes("Developer"))
};

export function TeamSection() {
  return (
    <div className="py-12">
      <motion.div 
        className="border-b border-secondary my-4"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      ></motion.div>
      <h2 className="text-4xl font-bold text-center mb-6 text-secondary drop-shadow-md">Meet Our Team</h2>
      <div className="flex flex-col gap-12">
        {Object.entries(GROUPED_MEMBERS).map(([role, members], index) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="w-full"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">{role}</h3>
            <div className="flex justify-center w-full px-4">
              <div className={`grid gap-6 w-full ${
                members.length === 1 ? 'md:w-1/4' : 
                members.length === 2 ? 'md:w-2/4' :
                'md:w-3/4'
              } grid-cols-1 ${
                members.length === 1 ? 'md:grid-cols-1' :
                members.length === 2 ? 'md:grid-cols-2' :
                'md:grid-cols-3'
              }`}>
                {members.map((member) => (
                  <TeamMember key={member.name} {...member} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 