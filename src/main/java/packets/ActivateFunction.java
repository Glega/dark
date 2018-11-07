package packets;

/**
 * Created by Worker2 on 26.06.2018.
 */
public class ActivateFunction {

    private NNFucntion f;
    private NNFucntion df;


    public ActivateFunction(NNFucntion f, NNFucntion df){

        this.f = f;
        this.df = df;

    }


    public int func(int x){
        return  f.f(x);
    }

    public int dFunc(int y){
        return df.f(y);
    }
}
