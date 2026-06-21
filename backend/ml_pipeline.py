import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain_classic.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

DB_DIR = "./chroma_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

def ingest_knowledge_base(pdf_path: str):
    """Loads a PDF textbook and stores it in a local vector database."""
    if os.path.exists(DB_DIR):
        return Chroma(persist_directory=DB_DIR, embedding_function=HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL))
    
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)
    
    vector_db = Chroma.from_documents(
        documents=docs, 
        embedding=HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL), 
        persist_directory=DB_DIR
    )
    return vector_db

def generate_question(role: str, skills: str):
    """Retrieves context and generates an interview question."""
    vector_db = ingest_knowledge_base("textbook.pdf")
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})
    
    llm = Ollama(model="llama3", temperature=0.7)
    
    # We simplified the template to only expect what LangChain naturally provides: {context} and {question}
    prompt_template = """
    You are an expert technical interviewer.
    
    Using ONLY the textbook context below, generate ONE specific, advanced technical question. 
    Do not use generic templates. Just output the question based on the prompt below.
    
    Context:
    {context}
    
    Prompt:
    {question}
    """
    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": PROMPT}
    )
    
    # We bake the role and skills directly into the query string here
    query = f"The candidate is applying for the {role} role and has the following skills: {skills}. Generate a highly specific interview question to test their understanding."
    
    return qa_chain.run(query)