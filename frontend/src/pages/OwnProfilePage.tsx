import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ArtistProfilePage from "./ArtistProfilePage";

export default function OwnProfilePage() {
  const { user, isArtist } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!isArtist) return <Navigate to="/" replace />;

  return <ArtistProfilePage ownProfile />;
}
