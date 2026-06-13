from pydantic import BaseModel, Field


class SequenceRequest(BaseModel):
    sequence: str = Field(default="", description="DNA or RNA sequence.")


class DNARequest(SequenceRequest):
    strand_type: str = Field(default="coding", pattern="^(coding|template)$")


class ValidateRequest(SequenceRequest):
    molecule: str = Field(default="dna", pattern="^(dna|rna)$")
