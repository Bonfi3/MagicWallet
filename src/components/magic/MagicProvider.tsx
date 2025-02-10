import { OAuthExtension } from '@magic-ext/oauth';
import { Magic as MagicBase } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SolanaExtension } from '@magic-ext/solana';
import { Connection } from '@solana/web3.js';

export type Magic = MagicBase<OAuthExtension[] & SolanaExtension[]>;

type MagicContextType = {
  magic: Magic | null;
  connection: Connection | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  connection: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY && process.env.NEXT_PUBLIC_RPCURL) {
      const magic = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
        extensions: [
          new OAuthExtension(),
          new SolanaExtension({
            rpcUrl: process.env.NEXT_PUBLIC_RPCURL,
          }),
        ],
      });
      const connection = new Connection(process.env.NEXT_PUBLIC_RPCURL);
      setMagic(magic);
      setConnection(connection);
    }
  }, []);

  const value = useMemo(() => {
    return {
      magic,
      connection,
    };
  }, [magic, connection]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
