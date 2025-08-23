"use client"
import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";
import { Activity, ArrowDownCircle, ArrowUpCircle, PlusCircle, Trash, TrendingDown, TrendingUp, Wallet } from "lucide-react"

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [text, setText] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false)

  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/")
      setTransactions(res.data)
      toast.success("Transactions chargées")
    } catch (error) {
      console.error("Erreur chargement transactions", error);
      toast.error("Erreur chargement transactions")
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`transactions/${id}/`)
      getTransactions()
      toast.success("Transaction supprimée avec succès")
    } catch (error) {
      console.error("Erreur suppression transaction", error);
      toast.error("Erreur suppression transaction")
    }
  }

  const addTransaction = async () => {
    if (!text || amount === "" || isNaN(Number(amount))) {
      toast.error("Merci de remplir texte et montant valides")
      return
    }
    setLoading(true)

    try {
      await api.post<Transaction>(`transactions/`, {
        text,
        amount: Number(amount)
      })
      getTransactions()
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement
      if (modal) {
        modal.close()
      }

      toast.success("Transaction ajoutée avec succès")
      setText("")
      setAmount("")
    } catch (error) {
      console.error("Erreur ajout transaction", error);
      toast.error("Erreur ajout transaction")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTransactions()
  }, []);

  // Fonction pour s'assurer que le montant est un nombre
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeAmount = (amount: any): number => {
    const num = Number(amount);
    return isNaN(num) ? 0 : num;
  };

  const amounts = transactions.map((t) => safeAmount(t.amount));
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0;
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0;
  const expense = Math.abs(amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0)) || 0;
  const ratio = income > 0 ? Math.min((expense / income) * 100, 100) : 0;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gestionnaire de Transactions Financières</h1>
        
        {/* Cartes de résumé financier */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Carte Solde */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all hover:shadow-xl">
            <div className="p-3 bg-blue-100 rounded-full mb-4">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Votre solde</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {balance.toFixed(2)} €
            </p>
          </div>
          
          {/* Carte Revenus */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all hover:shadow-xl">
            <div className="p-3 bg-green-100 rounded-full mb-4">
              <ArrowUpCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Revenus</p>
            <p className="text-2xl font-bold text-green-600">{income.toFixed(2)} €</p>
          </div>
          
          {/* Carte Dépenses */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all hover:shadow-xl">
            <div className="p-3 bg-red-100 rounded-full mb-4">
              <ArrowDownCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Dépenses</p>
            <p className="text-2xl font-bold text-red-600">{expense.toFixed(2)} €</p>
          </div>
          
          {/* Carte Ratio */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-all hover:shadow-xl">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Dépenses/Revenus</p>
            <p className="text-2xl font-bold text-purple-600">{ratio.toFixed(0)}%</p>
          </div>
        </div>
        
        {/* Barre de progression pour le ratio */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Activity className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Ratio Dépenses/Revenus</span>
            </div>
            <div className="font-semibold text-purple-600">{ratio.toFixed(0)}%</div>
          </div>
          <progress
            className="progress progress-primary w-full h-4"
            value={ratio}
            max={100}
          ></progress>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Bouton pour ajouter une transaction */}
        <div className="flex justify-center mb-8">
          <button 
            className="btn btn-primary px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            onClick={() => {
              const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
              if (modal) modal.showModal();
            }}
          >
            <PlusCircle className="w-5 h-5" />
            Ajouter une transaction
          </button>
        </div>
        
        {/* Tableau des transactions */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Historique des transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-600 font-medium">#</th>
                  <th className="py-4 px-6 text-left text-gray-600 font-medium">Description</th>
                  <th className="py-4 px-6 text-left text-gray-600 font-medium">Montant</th>
                  <th className="py-4 px-6 text-left text-gray-600 font-medium">Date</th>
                  <th className="py-4 px-6 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Aucune transaction enregistrée
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, index) => {
                    // S'assurer que le montant est un nombre avant d'utiliser toFixed()
                    const transactionAmount = safeAmount(t.amount);
                    return (
                      <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">{index + 1}</td>
                        <td className="py-4 px-6">{t.text}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {transactionAmount > 0 ? (
                              <TrendingUp className="text-green-600 w-5 h-5" />
                            ) : (
                              <TrendingDown className="text-red-600 w-5 h-5" />
                            )}
                            <span className={`font-semibold ${transactionAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transactionAmount > 0 ? `+${transactionAmount.toFixed(2)}` : `${transactionAmount.toFixed(2)}`} €
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-500">{formatDate(t.created_at)}</td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="btn btn-sm btn-error btn-outline rounded-full"
                            title="Supprimer"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter une transaction */}
      <dialog id="my_modal_3" className="modal backdrop-blur-sm">
        <div className="modal-box border border-gray-200 shadow-2xl max-w-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
          </form>
          <h3 className="font-bold text-xl text-gray-800 mb-6 text-center">Ajouter une transaction</h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">Description</label>
              <input
                type="text"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Entrez la description..."
                className="input input-bordered w-full focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">
                Montant <span className="text-sm text-gray-500">(négatif = dépense, positif = revenu)</span>
              </label>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(
                  e.target.value === "" ? "" : Number(e.target.value)
                )}
                placeholder="Entrez le montant..."
                className="input input-bordered w-full focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              className="w-full btn btn-primary py-3 rounded-lg mt-4"
              onClick={addTransaction}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Ajouter
                </>
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}