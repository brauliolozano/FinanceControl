import React from "react";

import { HighlightCard } from '../../HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../TransactionCard';


import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard(){
    const data: DataListProps[] = [
        {
        id: '1',
        type: 'positive',
        title: "Desenvolvimento de site",
        amount: "R$ 12.000,00",
        category: {
            name: 'Vendas',
            icon: 'dollar-sign'
                },
        date: "13/08/2022"
    },
    {
        id: '2',
        type: 'negative',
        title: "Hamburgueria Pizzy",
        amount: "R$ 59,00",
        category: {
            name: 'Alimentação',
            icon: 'coffee'
                },
        date: "10/08/2022"
    },
    {
        id: '3',
        type: 'negative',
        title: "Aluguel do apartamento",
        amount: "R$ 1.200,00",
        category: {
            name: 'Casa',
            icon: 'shopping-bag'
                },
        date: "10/08/2022"
    }
];
    return(
<Container>
    <Header>
        <UserWrapper>
            <UserInfo>
                <Photo 
                source={{ uri: 'https://github.com/brauliolozano.png'}}
                />
                <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>Braulio</UserName>
                </User>
            </UserInfo>
          <Icon name={"power"} />
        </UserWrapper>
     
    </Header>
        <HighlightCards>
            <HighlightCard 
            title="Entradas" 
            amount="R$ 17.400,00" 
            lastTransaction="Última entrada dia 13 de agosto" 
            type="up"
            />
            <HighlightCard 
            title="Saídas" 
            amount="R$ 1.259,00" 
            lastTransaction="Última saída dia 17 de agosto"
            type="down"
            />
            <HighlightCard 
            title="Total" 
            amount="R$ 16.141,00" 
            lastTransaction="01 à 17 de agosto"
            type="total"
            />
        </HighlightCards>

        <Transactions>
            <Title>Listagem</Title>

           <TransactionList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
            />

            
        </Transactions>
    </Container>
    )
}