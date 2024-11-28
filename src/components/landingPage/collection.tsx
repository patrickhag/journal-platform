import { articleSubmissions, db, metadata, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import React from "react";

const Collections = async () => {
  const collections = [
    {
      id: 1,
      title: "Lorem ipsum collection 1",
      image:
        "https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png",
    },
    {
      id: 2,
      title: "Lorem ipsum collection 2",
      image:
        "https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png",
    },
    {
      id: 3,
      title: "Lorem ipsum collection 3",
      image:
        "https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png",
    },
    {
      id: 4,
      title: "Lorem ipsum collection 3",
      image:
        "https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732723406/newss_espiuv.png",
    },
  ];

  const articles = await db
    .select({
      id: articleSubmissions.id,
      abstract: metadata.abstract,
      title: metadata.title,
      createdAt: articleSubmissions.createdAt,
      authorFName: users.firstName,
      authorLName: users.lastName
    })
    .from(articleSubmissions)
    .leftJoin(metadata, eq(articleSubmissions.id, metadata.articleId))
    .leftJoin(users, eq(articleSubmissions.userId, users.id));

  return (
    <div className="col-span-3 space-y-8">
      <div className="w-[90%]">
        <h1 className="text-2xl font-bold mb-4 " style={{ color: "#1A237E" }}>
          Aims and scope
        </h1>
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
          Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          Lorem dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit
          amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
          dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
        </p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: "#1A237E" }}>
          Recently Published
        </h2>

        {articles.map(a => (

          <div className="space-y-6 w-[90%]" key={a.id}>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg text-gray-800">
                {a.title}              </h3>
              <p className="text-sm text-gray-600">
                {a.authorFName} {a.authorLName}
              </p>
              <p className="text-sm text-gray-500">{a.createdAt}</p>
            </div>
          </div>))}


        <div className="w-[70%]">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#1A237E" }}>
            Our largest collections
          </h2>
          <div className="grid grid-cols-2">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-gray-100 p-2 rounded-md shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-medium">{collection.title}</h3>
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="object-cover rounded-md mb-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
